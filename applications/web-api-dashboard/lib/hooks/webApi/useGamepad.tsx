import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type GamepadButtonState = {
  pressed: boolean;
  touched: boolean;
  value: number;
};

export type GamepadInfo = {
  id: string;
  index: number;
  connected: boolean;
  mapping: GamepadMappingType;
  timestamp: number;
  axes: number[];
  buttons: GamepadButtonState[];
};

export type GamepadError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type UseGamepadOptions = {
  /**
   * If true, listens for gamepad connect/disconnect events and polls state updates.
   */
  watch?: boolean;

  /**
   * If true, loads the current connected gamepads once on mount.
   * Ignored when watch=true, because watch mode refreshes automatically.
   */
  immediate?: boolean;

  /**
   * If true, includes disconnected slots returned by navigator.getGamepads().
   */
  includeDisconnected?: boolean;
};

export type UseGamepadResult = {
  supported: boolean;
  loading: boolean;
  gamepads: GamepadInfo[];
  error: GamepadError | null;

  refresh: () => GamepadInfo[];
  startWatching: () => void;
  stopWatching: () => void;
  clearError: () => void;
};

function toGamepadButtonState(button: GamepadButton): GamepadButtonState {
  return {
    pressed: button.pressed,
    touched: button.touched,
    value: button.value,
  };
}

function toGamepadInfo(gamepad: Gamepad): GamepadInfo {
  return {
    id: gamepad.id,
    index: gamepad.index,
    connected: gamepad.connected,
    mapping: gamepad.mapping,
    timestamp: gamepad.timestamp,
    axes: [...gamepad.axes],
    buttons: Array.from(gamepad.buttons, toGamepadButtonState),
  };
}

function mapUnknownGamepadError(err: unknown): GamepadError {
  const message = err instanceof Error ? err.message : 'Unknown gamepad error.';

  return {
    code: 'UNKNOWN',
    message,
  };
}

function hasConnectedGamepads(next: GamepadInfo[]): boolean {
  return next.some(gamepad => gamepad.connected);
}

export function useGamepad(options: UseGamepadOptions = {}): UseGamepadResult {
  const { watch = true, immediate = true, includeDisconnected = false } = options;

  const supported = typeof window !== 'undefined' && typeof navigator.getGamepads === 'function';

  const [loading, setLoading] = useState<boolean>(false);
  const [gamepads, setGamepads] = useState<GamepadInfo[]>([]);
  const [error, setError] = useState<GamepadError | null>(
    supported
      ? null
      : {
          code: 'UNSUPPORTED',
          message: 'Gamepad API is not supported by this browser.',
        },
  );

  const watchingRef = useRef<boolean>(false);
  const frameRef = useRef<number | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const readGamepads = useCallback((): GamepadInfo[] => {
    const next = navigator
      .getGamepads()
      .filter((gamepad): gamepad is Gamepad => gamepad !== null)
      .filter(gamepad => includeDisconnected || gamepad.connected)
      .map(toGamepadInfo);

    return next;
  }, [includeDisconnected]);

  const syncGamepads = useCallback((): GamepadInfo[] => {
    const next = readGamepads();
    setGamepads(next);
    setError(null);
    return next;
  }, [readGamepads]);

  const refresh = useCallback((): GamepadInfo[] => {
    if (!supported) {
      const nextError: GamepadError = {
        code: 'UNSUPPORTED',
        message: 'Gamepad API is not supported by this browser.',
      };
      setError(nextError);
      throw nextError;
    }

    setLoading(true);

    try {
      return syncGamepads();
    } catch (err) {
      const mapped = mapUnknownGamepadError(err);
      setError(mapped);
      throw mapped;
    } finally {
      setLoading(false);
    }
  }, [supported, syncGamepads]);

  const pollFrame = useCallback(() => {
    if (!watchingRef.current) return;

    try {
      const next = syncGamepads();

      if (!hasConnectedGamepads(next)) {
        cancelFrame();
        return;
      }
    } catch (err) {
      setError(mapUnknownGamepadError(err));
    }

    frameRef.current = window.requestAnimationFrame(pollFrame);
  }, [syncGamepads, cancelFrame]);

  const handleConnectionChange = useCallback(() => {
    if (!watchingRef.current) return;

    try {
      const next = syncGamepads();

      cancelFrame();

      if (hasConnectedGamepads(next)) {
        frameRef.current = window.requestAnimationFrame(pollFrame);
      }
    } catch (err) {
      setError(mapUnknownGamepadError(err));
    }
  }, [syncGamepads, cancelFrame, pollFrame]);

  const stopWatching = useCallback(() => {
    if (!supported || !watchingRef.current) return;

    watchingRef.current = false;
    cancelFrame();
    window.removeEventListener('gamepadconnected', handleConnectionChange as EventListener);
    window.removeEventListener('gamepaddisconnected', handleConnectionChange as EventListener);
  }, [supported, cancelFrame, handleConnectionChange]);

  const startWatching = useCallback(() => {
    if (!supported) {
      setError({
        code: 'UNSUPPORTED',
        message: 'Gamepad API is not supported by this browser.',
      });
      return;
    }

    if (watchingRef.current) return;

    watchingRef.current = true;
    setError(null);

    window.addEventListener('gamepadconnected', handleConnectionChange as EventListener);
    window.addEventListener('gamepaddisconnected', handleConnectionChange as EventListener);

    handleConnectionChange();
  }, [supported, handleConnectionChange]);

  useEffect(() => {
    if (!supported) return;

    if (watch) {
      startWatching();
      return () => stopWatching();
    }

    if (immediate) {
      try {
        refresh();
      } catch {
        // ignore on mount; exposed via error state
      }
    }

    return () => {
      stopWatching();
    };
  }, [supported, watch, immediate, startWatching, stopWatching, refresh]);

  return useMemo(
    () => ({
      supported,
      loading,
      gamepads,
      error,
      refresh,
      startWatching,
      stopWatching,
      clearError,
    }),
    [supported, loading, gamepads, error, refresh, startWatching, stopWatching, clearError],
  );
}

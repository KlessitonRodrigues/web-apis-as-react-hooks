import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type BatteryManagerLike = EventTarget & {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
};

type NavigatorBatteryLike = Navigator & {
  getBattery?: () => Promise<BatteryManagerLike>;
};

export type BatteryInfo = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  levelPercent: number;
};

export type BatteryError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'NOT_AVAILABLE'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type UseBaterryOptions = {
  /**
   * If true, attaches battery event listeners on mount.
   */
  watch?: boolean;

  /**
   * If true, loads current battery status once on mount.
   * Ignored when watch=true, because watch mode will load automatically.
   */
  immediate?: boolean;
};

export type UseBaterryResult = {
  supported: boolean;
  loading: boolean;
  battery: BatteryInfo | null;
  error: BatteryError | null;

  refresh: () => Promise<BatteryInfo>;
  startWatching: () => void;
  stopWatching: () => void;
  clearError: () => void;
};

function toBatteryInfo(manager: BatteryManagerLike): BatteryInfo {
  const levelPercent = Math.round(manager.level * 100);

  return {
    charging: manager.charging,
    chargingTime: manager.chargingTime,
    dischargingTime: manager.dischargingTime,
    level: manager.level,
    levelPercent,
  };
}

function mapBatteryError(err: unknown): BatteryError {
  const message = err instanceof Error ? err.message : 'Unknown battery error.';

  if (message.toLowerCase().includes('not available')) {
    return {
      code: 'NOT_AVAILABLE',
      message,
    };
  }

  return {
    code: 'UNKNOWN',
    message,
  };
}

export function useBaterry(options: UseBaterryOptions = {}): UseBaterryResult {
  const { watch = false, immediate = true } = options;

  const nav = navigator as NavigatorBatteryLike;
  const supported = typeof window !== 'undefined' && typeof nav.getBattery === 'function';

  const [loading, setLoading] = useState<boolean>(false);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [error, setError] = useState<BatteryError | null>(
    supported
      ? null
      : {
          code: 'UNSUPPORTED',
          message: 'Battery Status API is not supported by this browser.',
        },
  );

  const batteryRef = useRef<BatteryManagerLike | null>(null);
  const watchingRef = useRef<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  const applyBatteryState = useCallback((manager: BatteryManagerLike) => {
    setBattery(toBatteryInfo(manager));
  }, []);

  const handleBatteryChange = useCallback(() => {
    if (!batteryRef.current) return;
    applyBatteryState(batteryRef.current);
  }, [applyBatteryState]);

  const detachListeners = useCallback(
    (manager: BatteryManagerLike | null) => {
      if (!manager) return;

      manager.removeEventListener('chargingchange', handleBatteryChange as EventListener);
      manager.removeEventListener('levelchange', handleBatteryChange as EventListener);
      manager.removeEventListener('chargingtimechange', handleBatteryChange as EventListener);
      manager.removeEventListener('dischargingtimechange', handleBatteryChange as EventListener);
    },
    [handleBatteryChange],
  );

  const attachListeners = useCallback(
    (manager: BatteryManagerLike) => {
      manager.addEventListener('chargingchange', handleBatteryChange as EventListener);
      manager.addEventListener('levelchange', handleBatteryChange as EventListener);
      manager.addEventListener('chargingtimechange', handleBatteryChange as EventListener);
      manager.addEventListener('dischargingtimechange', handleBatteryChange as EventListener);
    },
    [handleBatteryChange],
  );

  const refresh = useCallback(async (): Promise<BatteryInfo> => {
    if (!supported || !nav.getBattery) {
      const nextError: BatteryError = {
        code: 'UNSUPPORTED',
        message: 'Battery Status API is not supported by this browser.',
      };
      setError(nextError);
      throw nextError;
    }

    setLoading(true);
    setError(null);

    try {
      const manager = await nav.getBattery();

      if (batteryRef.current && batteryRef.current !== manager) {
        detachListeners(batteryRef.current);
      }

      batteryRef.current = manager;
      applyBatteryState(manager);

      if (watchingRef.current) {
        detachListeners(manager);
        attachListeners(manager);
      }

      return toBatteryInfo(manager);
    } catch (err) {
      const mapped = mapBatteryError(err);
      setError(mapped);
      throw mapped;
    } finally {
      setLoading(false);
    }
  }, [supported, nav, detachListeners, applyBatteryState, attachListeners]);

  const stopWatching = useCallback(() => {
    watchingRef.current = false;
    detachListeners(batteryRef.current);
  }, [detachListeners]);

  const startWatching = useCallback(() => {
    if (!supported) {
      setError({
        code: 'UNSUPPORTED',
        message: 'Battery Status API is not supported by this browser.',
      });
      return;
    }

    watchingRef.current = true;

    if (batteryRef.current) {
      detachListeners(batteryRef.current);
      attachListeners(batteryRef.current);
      applyBatteryState(batteryRef.current);
      return;
    }

    void refresh().catch(() => {
      watchingRef.current = false;
    });
  }, [supported, detachListeners, attachListeners, applyBatteryState, refresh]);

  useEffect(() => {
    if (!supported) return;

    if (watch) {
      startWatching();
      return () => stopWatching();
    }

    if (immediate) {
      void refresh().catch(() => {});
    }

    return () => {
      stopWatching();
    };
  }, [supported, watch, immediate, startWatching, stopWatching, refresh]);

  return useMemo(
    () => ({
      supported,
      loading,
      battery,
      error,
      refresh,
      startWatching,
      stopWatching,
      clearError,
    }),
    [supported, loading, battery, error, refresh, startWatching, stopWatching, clearError],
  );
}

// Alias kept for conventional spelling while preserving existing file/API naming.
export const useBattery = useBaterry;

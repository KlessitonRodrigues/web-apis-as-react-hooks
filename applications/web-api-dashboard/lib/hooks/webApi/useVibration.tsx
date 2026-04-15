import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type VibrationPatternValue = number | number[];

type NavigatorVibrationLike = Navigator & {
  vibrate?: (pattern: VibrationPatternValue) => boolean;
  webkitVibrate?: (pattern: VibrationPatternValue) => boolean;
  mozVibrate?: (pattern: VibrationPatternValue) => boolean;
};

export type VibrationError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'INVALID_PATTERN'; message: string }
  | { code: 'REJECTED'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type UseVibrationOptions = {
  /**
   * If true, vibrates once on mount using `pattern`.
   */
  immediate?: boolean;

  /**
   * Default vibration pattern used by `vibrate()` when no pattern is provided.
   */
  pattern?: VibrationPatternValue;
};

export type UseVibrationResult = {
  supported: boolean;
  vibrating: boolean;
  lastPattern: VibrationPatternValue | null;
  error: VibrationError | null;

  vibrate: (pattern?: VibrationPatternValue) => boolean;
  cancel: () => void;
  clearError: () => void;
};

function normalizePattern(pattern: VibrationPatternValue): VibrationPatternValue | null {
  if (Array.isArray(pattern)) {
    if (pattern.some(value => !Number.isFinite(value) || value < 0)) {
      return null;
    }

    return pattern.map(value => Math.trunc(value));
  }

  if (!Number.isFinite(pattern) || pattern < 0) {
    return null;
  }

  return Math.trunc(pattern);
}

function getPatternDuration(pattern: VibrationPatternValue): number {
  if (Array.isArray(pattern)) {
    return pattern.reduce((total, value) => total + value, 0);
  }

  return pattern;
}

function getVibrateMethod(nav: NavigatorVibrationLike) {
  if (typeof nav.vibrate === 'function') {
    return nav.vibrate.bind(nav);
  }

  if (typeof nav.webkitVibrate === 'function') {
    return nav.webkitVibrate.bind(nav);
  }

  if (typeof nav.mozVibrate === 'function') {
    return nav.mozVibrate.bind(nav);
  }

  return null;
}

export function useVibration(options: UseVibrationOptions = {}): UseVibrationResult {
  const { immediate = false, pattern: defaultPattern = 200 } = options;

  const nav = typeof navigator === 'undefined' ? null : (navigator as NavigatorVibrationLike);
  const supported = typeof window !== 'undefined' && !!nav && !!getVibrateMethod(nav);

  const [vibrating, setVibrating] = useState<boolean>(false);
  const [lastPattern, setLastPattern] = useState<VibrationPatternValue | null>(null);
  const [error, setError] = useState<VibrationError | null>(
    supported
      ? null
      : {
          code: 'UNSUPPORTED',
          message: 'Vibration API is not supported by this browser.',
        },
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const cancel = useCallback(() => {
    if (!supported || !nav) {
      setVibrating(false);
      return;
    }

    clearPendingTimeout();
    getVibrateMethod(nav)?.(0);
    setVibrating(false);
  }, [supported, nav, clearPendingTimeout]);

  const vibrate = useCallback(
    (patternArg?: VibrationPatternValue): boolean => {
      if (!supported || !nav) {
        setError({
          code: 'UNSUPPORTED',
          message: 'Vibration API is not supported by this browser.',
        });
        return false;
      }

      const resolvedPattern = patternArg ?? defaultPattern;
      const normalizedPattern = normalizePattern(resolvedPattern);

      if (normalizedPattern === null) {
        setError({
          code: 'INVALID_PATTERN',
          message: 'Vibration pattern must contain only non-negative finite numbers.',
        });
        return false;
      }

      const vibrateMethod = getVibrateMethod(nav);

      if (!vibrateMethod) {
        setError({
          code: 'UNSUPPORTED',
          message: 'Vibration API is not supported by this browser.',
        });
        return false;
      }

      clearPendingTimeout();
      setError(null);

      try {
        const accepted = vibrateMethod(normalizedPattern);

        if (!accepted) {
          setVibrating(false);
          setError({
            code: 'REJECTED',
            message: 'The browser rejected the vibration request.',
          });
          return false;
        }

        const duration = getPatternDuration(normalizedPattern);

        setLastPattern(normalizedPattern);
        setVibrating(duration > 0);

        if (duration > 0) {
          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            setVibrating(false);
          }, duration);
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown vibration error.';

        setVibrating(false);
        setError({
          code: 'UNKNOWN',
          message,
        });
        return false;
      }
    },
    [supported, nav, defaultPattern, clearPendingTimeout],
  );

  useEffect(() => {
    if (!supported || !immediate) return;

    vibrate(defaultPattern);
  }, [supported, immediate, defaultPattern, vibrate]);

  useEffect(() => {
    return () => {
      cancel();
      clearPendingTimeout();
    };
  }, [cancel, clearPendingTimeout]);

  return useMemo(
    () => ({
      supported,
      vibrating,
      lastPattern,
      error,
      vibrate,
      cancel,
      clearError,
    }),
    [supported, vibrating, lastPattern, error, vibrate, cancel, clearError],
  );
}

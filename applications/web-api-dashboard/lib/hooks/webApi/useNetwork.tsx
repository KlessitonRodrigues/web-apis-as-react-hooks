import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type NetworkInformationLike = EventTarget & {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
};

type NavigatorNetworkLike = Navigator & {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

export type NetworkInfo = {
  online: boolean;
  downlink: number | null;
  downlinkMax: number | null;
  effectiveType: string | null;
  rtt: number | null;
  saveData: boolean | null;
  type: string | null;
  timestamp: number; // ms since epoch
};

export type NetworkError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type UseNetworkOptions = {
  /**
   * If true, subscribes to online/offline + connection change events on mount.
   */
  watch?: boolean;

  /**
   * If true, loads current network state once on mount.
   */
  immediate?: boolean;
};

export type UseNetworkResult = {
  supported: boolean;
  loading: boolean;
  network: NetworkInfo | null;
  error: NetworkError | null;

  // actions
  refresh: () => NetworkInfo;
  startWatching: () => void;
  stopWatching: () => void;
  clearError: () => void;
};

function mapUnknownNetworkError(err: unknown): NetworkError {
  const message = err instanceof Error ? err.message : 'Unknown network error.';

  return {
    code: 'UNKNOWN',
    message,
  };
}

function toNetworkInfo(nav: NavigatorNetworkLike): NetworkInfo {
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

  return {
    online: nav.onLine,
    downlink: typeof connection?.downlink === 'number' ? connection.downlink : null,
    downlinkMax: typeof connection?.downlinkMax === 'number' ? connection.downlinkMax : null,
    effectiveType: typeof connection?.effectiveType === 'string' ? connection.effectiveType : null,
    rtt: typeof connection?.rtt === 'number' ? connection.rtt : null,
    saveData: typeof connection?.saveData === 'boolean' ? connection.saveData : null,
    type: typeof connection?.type === 'string' ? connection.type : null,
    timestamp: Date.now(),
  };
}

export function useNetwork(options: UseNetworkOptions = {}): UseNetworkResult {
  const { watch = true, immediate = true } = options;

  const supported = typeof window !== 'undefined' && typeof navigator !== 'undefined';

  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [error, setError] = useState<NetworkError | null>(
    supported
      ? null
      : {
          code: 'UNSUPPORTED',
          message: 'Network Information API is not supported by this environment.',
        },
  );

  const watchingRef = useRef<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  const getNavigator = useCallback((): NavigatorNetworkLike | null => {
    if (!supported) return null;
    return navigator as NavigatorNetworkLike;
  }, [supported]);

  const refresh = useCallback((): NetworkInfo => {
    const nav = getNavigator();

    if (!nav) {
      const nextError: NetworkError = {
        code: 'UNSUPPORTED',
        message: 'Network Information API is not supported by this environment.',
      };
      setError(nextError);
      throw nextError;
    }

    setLoading(true);

    try {
      setError(null);
      const next = toNetworkInfo(nav);
      setNetwork(next);
      return next;
    } catch (err) {
      const mapped = mapUnknownNetworkError(err);
      setError(mapped);
      throw mapped;
    } finally {
      setLoading(false);
    }
  }, [getNavigator]);

  const handleChange = useCallback(() => {
    try {
      refresh();
    } catch {
      // keep current state and surfaced error from refresh
    }
  }, [refresh]);

  const stopWatching = useCallback(() => {
    if (!supported || !watchingRef.current) return;

    const nav = navigator as NavigatorNetworkLike;
    const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

    window.removeEventListener('online', handleChange);
    window.removeEventListener('offline', handleChange);
    connection?.removeEventListener('change', handleChange as EventListener);

    watchingRef.current = false;
  }, [supported, handleChange]);

  const startWatching = useCallback(() => {
    if (!supported) {
      setError({
        code: 'UNSUPPORTED',
        message: 'Network Information API is not supported by this environment.',
      });
      return;
    }

    if (watchingRef.current) return;

    const nav = navigator as NavigatorNetworkLike;
    const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    connection?.addEventListener('change', handleChange as EventListener);

    watchingRef.current = true;
    handleChange();
  }, [supported, handleChange]);

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
      network,
      error,
      refresh,
      startWatching,
      stopWatching,
      clearError,
    }),
    [supported, loading, network, error, refresh, startWatching, stopWatching, clearError],
  );
}

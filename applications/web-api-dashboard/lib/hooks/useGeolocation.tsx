import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GeolocationCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number; // ms since epoch
};

export type GeolocationError =
  | { code: "UNSUPPORTED"; message: string }
  | { code: "PERMISSION_DENIED"; message: string }
  | { code: "POSITION_UNAVAILABLE"; message: string }
  | { code: "TIMEOUT"; message: string }
  | { code: "UNKNOWN"; message: string };

export type UseGeolocationOptions = {
  /**
   * If true, starts navigator.geolocation.watchPosition on mount.
   * If false, you can call `getCurrentPosition()` manually.
   */
  watch?: boolean;

  /**
   * Passed through to browser geolocation.
   */
  positionOptions?: PositionOptions;

  /**
   * If true, immediately request location once on mount (only when watch=false).
   */
  immediate?: boolean;
};

export type UseGeolocationResult = {
  supported: boolean;
  loading: boolean;
  coords: GeolocationCoords | null;
  error: GeolocationError | null;

  // actions
  getCurrentPosition: () => Promise<GeolocationCoords>;
  startWatching: () => void;
  stopWatching: () => void;
  clearError: () => void;
};

function mapBrowserError(err: GeolocationPositionError): GeolocationError {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return {
        code: "PERMISSION_DENIED",
        message: err.message || "Permission denied.",
      };
    case err.POSITION_UNAVAILABLE:
      return {
        code: "POSITION_UNAVAILABLE",
        message: err.message || "Position unavailable.",
      };
    case err.TIMEOUT:
      return {
        code: "TIMEOUT",
        message: err.message || "Geolocation timeout.",
      };
    default:
      return {
        code: "UNKNOWN",
        message: err.message || "Unknown geolocation error.",
      };
  }
}

function toCoords(pos: GeolocationPosition): GeolocationCoords {
  const c = pos.coords;
  return {
    latitude: c.latitude,
    longitude: c.longitude,
    accuracy: c.accuracy,
    altitude: c.altitude,
    altitudeAccuracy: c.altitudeAccuracy,
    heading: c.heading,
    speed: c.speed,
    timestamp: pos.timestamp,
  };
}

export function useGeolocation(
  options: UseGeolocationOptions = {},
): UseGeolocationResult {
  const { watch = false, immediate = true, positionOptions } = options;

  const supported = typeof window !== "undefined" && "geolocation" in navigator;

  const [loading, setLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [error, setError] = useState<GeolocationError | null>(
    supported
      ? null
      : {
          code: "UNSUPPORTED",
          message: "Geolocation is not supported by this browser.",
        },
  );

  const watchIdRef = useRef<number | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const stopWatching = useCallback(() => {
    if (!supported) return;
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, [supported]);

  const startWatching = useCallback(() => {
    if (!supported) {
      setError({
        code: "UNSUPPORTED",
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    // avoid multiple watches
    if (watchIdRef.current !== null) return;

    setLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords(toCoords(pos));
        setLoading(false);
      },
      (err) => {
        setError(mapBrowserError(err));
        setLoading(false);
      },
      positionOptions,
    );
  }, [supported, positionOptions]);

  const getCurrentPosition = useCallback((): Promise<GeolocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!supported) {
        const e: GeolocationError = {
          code: "UNSUPPORTED",
          message: "Geolocation is not supported by this browser.",
        };
        setError(e);
        reject(e);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = toCoords(pos);
          setCoords(next);
          setLoading(false);
          resolve(next);
        },
        (err) => {
          const mapped = mapBrowserError(err);
          setError(mapped);
          setLoading(false);
          reject(mapped);
        },
        positionOptions,
      );
    });
  }, [supported, positionOptions]);

  // lifecycle behavior
  useEffect(() => {
    if (!supported) return;

    if (watch) {
      startWatching();
      return () => stopWatching();
    }

    if (!watch && immediate) {
      // fire once on mount (ignore promise)
      void getCurrentPosition().catch(() => {});
    }

    return () => {
      // if someone started watching manually, still clean up
      stopWatching();
    };
  }, [
    supported,
    watch,
    immediate,
    startWatching,
    stopWatching,
    getCurrentPosition,
  ]);

  return useMemo(
    () => ({
      supported,
      loading,
      coords,
      error,
      getCurrentPosition,
      startWatching,
      stopWatching,
      clearError,
    }),
    [
      supported,
      loading,
      coords,
      error,
      getCurrentPosition,
      startWatching,
      stopWatching,
      clearError,
    ],
  );
}

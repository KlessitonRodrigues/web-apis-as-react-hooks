import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type BluetoothRequestDeviceOptions = {
  acceptAllDevices?: boolean;
  filters?: Array<Record<string, unknown>>;
  optionalServices?: string[];
};

type BluetoothRemoteGATTServerLike = {
  connected: boolean;
  connect: () => Promise<BluetoothRemoteGATTServerLike>;
  disconnect: () => void;
};

type BluetoothDeviceLike = EventTarget & {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServerLike;
};

type NavigatorBluetoothLike = Navigator & {
  bluetooth?: {
    requestDevice: (options: BluetoothRequestDeviceOptions) => Promise<BluetoothDeviceLike>;
  };
};

export type BluetoothDeviceInfo = {
  id: string;
  name: string | null;
  connected: boolean;
};

export type BluetoothError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'NOT_SECURE_CONTEXT'; message: string }
  | { code: 'NOT_FOUND'; message: string }
  | { code: 'NOT_ALLOWED'; message: string }
  | { code: 'CONNECTION_FAILED'; message: string }
  | { code: 'DISCONNECTED'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type UseBluethootOptions = {
  /**
   * Browser device picker options.
   * If omitted, defaults to { acceptAllDevices: true }.
   */
  requestDeviceOptions?: BluetoothRequestDeviceOptions;

  /**
   * If true, connect automatically right after a device is selected.
   */
  autoConnect?: boolean;
};

export type UseBluethootResult = {
  supported: boolean;
  secureContext: boolean;
  loading: boolean;
  pairing: boolean;
  connected: boolean;
  device: BluetoothDeviceLike | null;
  deviceInfo: BluetoothDeviceInfo | null;
  error: BluetoothError | null;

  requestDevice: () => Promise<BluetoothDeviceLike>;
  pairDevice: () => Promise<BluetoothRemoteGATTServerLike>;
  findAndPair: () => Promise<{
    device: BluetoothDeviceLike;
    server: BluetoothRemoteGATTServerLike;
  }>;
  disconnect: () => void;
  clearError: () => void;
};

function mapBluetoothError(err: unknown): BluetoothError {
  const message = err instanceof Error ? err.message : 'Unknown bluetooth error.';
  const normalized = message.toLowerCase();

  if (normalized.includes('not found') || normalized.includes('no devices')) {
    return { code: 'NOT_FOUND', message };
  }

  if (
    normalized.includes('user cancelled') ||
    normalized.includes('permission denied') ||
    normalized.includes('not allowed')
  ) {
    return { code: 'NOT_ALLOWED', message };
  }

  if (normalized.includes('gatt') || normalized.includes('failed')) {
    return { code: 'CONNECTION_FAILED', message };
  }

  return { code: 'UNKNOWN', message };
}

export function useBluethoot(options: UseBluethootOptions = {}): UseBluethootResult {
  const { autoConnect = true, requestDeviceOptions } = options;

  const nav = navigator as NavigatorBluetoothLike;
  const supported = typeof window !== 'undefined' && Boolean(nav.bluetooth);
  const secureContext = typeof window !== 'undefined' ? window.isSecureContext : true;

  const [loading, setLoading] = useState<boolean>(false);
  const [pairing, setPairing] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [device, setDevice] = useState<BluetoothDeviceLike | null>(null);
  const [error, setError] = useState<BluetoothError | null>(() => {
    if (!supported) {
      return {
        code: 'UNSUPPORTED',
        message: 'Web Bluetooth is not supported by this browser.',
      };
    }

    if (!secureContext) {
      return {
        code: 'NOT_SECURE_CONTEXT',
        message: 'Web Bluetooth requires HTTPS (secure context).',
      };
    }

    return null;
  });

  const deviceRef = useRef<BluetoothDeviceLike | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleDisconnected = useCallback(() => {
    setConnected(false);
    setError({
      code: 'DISCONNECTED',
      message: 'Bluetooth device disconnected.',
    });
  }, []);

  const requestDevice = useCallback(async (): Promise<BluetoothDeviceLike> => {
    if (!supported) {
      const nextError: BluetoothError = {
        code: 'UNSUPPORTED',
        message: 'Web Bluetooth is not supported by this browser.',
      };
      setError(nextError);
      throw nextError;
    }

    if (!secureContext) {
      const nextError: BluetoothError = {
        code: 'NOT_SECURE_CONTEXT',
        message: 'Web Bluetooth requires HTTPS (secure context).',
      };
      setError(nextError);
      throw nextError;
    }

    setLoading(true);
    setError(null);

    try {
      if (!nav.bluetooth) {
        throw new Error('Web Bluetooth is not supported by this browser.');
      }

      const selected = await nav.bluetooth.requestDevice(
        requestDeviceOptions ?? { acceptAllDevices: true },
      );

      if (deviceRef.current && deviceRef.current !== selected) {
        deviceRef.current.removeEventListener('gattserverdisconnected', handleDisconnected);
      }

      selected.addEventListener('gattserverdisconnected', handleDisconnected);
      deviceRef.current = selected;
      setDevice(selected);
      setConnected(selected.gatt?.connected ?? false);

      return selected;
    } catch (err) {
      const mapped = mapBluetoothError(err);
      setError(mapped);
      throw mapped;
    } finally {
      setLoading(false);
    }
  }, [supported, secureContext, requestDeviceOptions, handleDisconnected, nav]);

  const pairDevice = useCallback(async (): Promise<BluetoothRemoteGATTServerLike> => {
    const current = deviceRef.current;

    if (!current) {
      const nextError: BluetoothError = {
        code: 'NOT_FOUND',
        message: 'No bluetooth device selected.',
      };
      setError(nextError);
      throw nextError;
    }

    if (!current.gatt) {
      const nextError: BluetoothError = {
        code: 'CONNECTION_FAILED',
        message: 'Selected device does not expose GATT server.',
      };
      setError(nextError);
      throw nextError;
    }

    if (current.gatt.connected) {
      setConnected(true);
      return current.gatt;
    }

    setPairing(true);
    setError(null);

    try {
      const server = await current.gatt.connect();
      setConnected(true);
      return server;
    } catch (err) {
      const mapped = mapBluetoothError(err);
      setError(mapped);
      throw mapped;
    } finally {
      setPairing(false);
    }
  }, []);

  const findAndPair = useCallback(async () => {
    const selected = await requestDevice();

    if (!autoConnect) {
      if (!selected.gatt) {
        const nextError: BluetoothError = {
          code: 'CONNECTION_FAILED',
          message: 'Selected device does not expose GATT server.',
        };
        setError(nextError);
        throw nextError;
      }

      return { device: selected, server: selected.gatt };
    }

    const server = await pairDevice();
    return { device: selected, server };
  }, [requestDevice, pairDevice, autoConnect]);

  const disconnect = useCallback(() => {
    const current = deviceRef.current;
    if (!current?.gatt) return;

    if (current.gatt.connected) {
      current.gatt.disconnect();
    }

    setConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      const current = deviceRef.current;
      if (!current) return;

      current.removeEventListener('gattserverdisconnected', handleDisconnected);

      if (current.gatt?.connected) {
        current.gatt.disconnect();
      }
    };
  }, [handleDisconnected]);

  const deviceInfo = useMemo<BluetoothDeviceInfo | null>(() => {
    if (!device) return null;

    return {
      id: device.id,
      name: device.name ?? null,
      connected,
    };
  }, [device, connected]);

  return useMemo(
    () => ({
      supported,
      secureContext,
      loading,
      pairing,
      connected,
      device,
      deviceInfo,
      error,
      requestDevice,
      pairDevice,
      findAndPair,
      disconnect,
      clearError,
    }),
    [
      supported,
      secureContext,
      loading,
      pairing,
      connected,
      device,
      deviceInfo,
      error,
      requestDevice,
      pairDevice,
      findAndPair,
      disconnect,
      clearError,
    ],
  );
}

// Alias kept for conventional spelling while preserving file/API naming.
export const useBluetooth = useBluethoot;

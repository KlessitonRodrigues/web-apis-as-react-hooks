import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type NotificationError =
	| { code: 'UNSUPPORTED'; message: string }
	| { code: 'PERMISSION_DENIED'; message: string }
	| { code: 'REQUEST_FAILED'; message: string }
	| { code: 'SHOW_FAILED'; message: string }
	| { code: 'UNKNOWN'; message: string };

export type UseNotificationOptions = {
	/**
	 * If true, asks for notification permission on mount when permission is `default`.
	 */
	immediate?: boolean;

	/**
	 * If true, showNotification() will request permission when permission is `default`.
	 */
	autoRequestPermission?: boolean;

	/**
	 * Default options merged with per-call options in showNotification().
	 */
	defaultNotificationOptions?: NotificationOptions;

	/**
	 * If true, closes the previous notification before showing a new one.
	 */
	closePrevious?: boolean;
};

export type UseNotificationResult = {
	supported: boolean;
	loading: boolean;
	permission: NotificationPermission | null;
	error: NotificationError | null;

	// actions
	requestPermission: () => Promise<NotificationPermission>;
	showNotification: (title: string, options?: NotificationOptions) => Promise<Notification>;
	closeNotification: () => void;
	clearError: () => void;
};

function mapNotificationError(err: unknown, fallbackCode: NotificationError['code']): NotificationError {
	const message = err instanceof Error ? err.message : 'Unknown notification error.';

	if (fallbackCode === 'PERMISSION_DENIED') {
		return {
			code: 'PERMISSION_DENIED',
			message: message || 'Notification permission denied.',
		};
	}

	if (fallbackCode === 'REQUEST_FAILED') {
		return {
			code: 'REQUEST_FAILED',
			message: message || 'Failed to request notification permission.',
		};
	}

	if (fallbackCode === 'SHOW_FAILED') {
		return {
			code: 'SHOW_FAILED',
			message: message || 'Failed to show notification.',
		};
	}

	return {
		code: 'UNKNOWN',
		message: message || 'Unknown notification error.',
	};
}

export function useNotification(options: UseNotificationOptions = {}): UseNotificationResult {
	const {
		immediate = false,
		autoRequestPermission = true,
		defaultNotificationOptions,
		closePrevious = true,
	} = options;

	const supported = typeof window !== 'undefined' && 'Notification' in window;

	const [loading, setLoading] = useState<boolean>(false);
	const [permission, setPermission] = useState<NotificationPermission | null>(
		supported ? Notification.permission : null,
	);
	const [error, setError] = useState<NotificationError | null>(
		supported
			? null
			: {
					code: 'UNSUPPORTED',
					message: 'Notifications are not supported by this browser.',
				},
	);

	const notificationRef = useRef<Notification | null>(null);

	const clearError = useCallback(() => setError(null), []);

	const closeNotification = useCallback(() => {
		if (notificationRef.current) {
			notificationRef.current.close();
			notificationRef.current = null;
		}
	}, []);

	const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
		if (!supported) {
			const nextError: NotificationError = {
				code: 'UNSUPPORTED',
				message: 'Notifications are not supported by this browser.',
			};
			setError(nextError);
			throw nextError;
		}

		setLoading(true);
		setError(null);

		try {
			const nextPermission = await Notification.requestPermission();
			setPermission(nextPermission);

			if (nextPermission === 'denied') {
				const deniedError: NotificationError = {
					code: 'PERMISSION_DENIED',
					message: 'Notification permission denied.',
				};
				setError(deniedError);
				throw deniedError;
			}

			return nextPermission;
		} catch (err) {
			const mapped = mapNotificationError(err, 'REQUEST_FAILED');
			setError(mapped);
			throw mapped;
		} finally {
			setLoading(false);
		}
	}, [supported]);

	const showNotification = useCallback(
		async (title: string, optionsArg?: NotificationOptions): Promise<Notification> => {
			if (!supported) {
				const nextError: NotificationError = {
					code: 'UNSUPPORTED',
					message: 'Notifications are not supported by this browser.',
				};
				setError(nextError);
				throw nextError;
			}

			setError(null);

			let nextPermission = Notification.permission;
			setPermission(nextPermission);

			if (nextPermission === 'default' && autoRequestPermission) {
				nextPermission = await requestPermission();
			}

			if (nextPermission !== 'granted') {
				const deniedError: NotificationError = {
					code: 'PERMISSION_DENIED',
					message: 'Notification permission is not granted.',
				};
				setError(deniedError);
				throw deniedError;
			}

			try {
				if (closePrevious) {
					closeNotification();
				}

				const instance = new Notification(title, {
					...defaultNotificationOptions,
					...optionsArg,
				});

				notificationRef.current = instance;
				return instance;
			} catch (err) {
				const mapped = mapNotificationError(err, 'SHOW_FAILED');
				setError(mapped);
				throw mapped;
			}
		},
		[
			supported,
			autoRequestPermission,
			requestPermission,
			closePrevious,
			closeNotification,
			defaultNotificationOptions,
		],
	);

	useEffect(() => {
		if (!supported) return;

		setPermission(Notification.permission);

		if (immediate && Notification.permission === 'default') {
			void requestPermission().catch(() => {});
		}
	}, [supported, immediate, requestPermission]);

	useEffect(() => {
		return () => {
			closeNotification();
		};
	}, [closeNotification]);

	return useMemo(
		() => ({
			supported,
			loading,
			permission,
			error,
			requestPermission,
			showNotification,
			closeNotification,
			clearError,
		}),
		[
			supported,
			loading,
			permission,
			error,
			requestPermission,
			showNotification,
			closeNotification,
			clearError,
		],
	);
}

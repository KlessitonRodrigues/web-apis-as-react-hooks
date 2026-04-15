import { useCallback, useMemo, useState } from 'react';

export type PaymentError =
  | { code: 'UNSUPPORTED'; message: string }
  | { code: 'ABORT_ERROR'; message: string }
  | { code: 'NOT_ALLOWED'; message: string }
  | { code: 'INVALID_STATE'; message: string }
  | { code: 'UNKNOWN'; message: string };

export type PaymentResult = {
  requestId: string;
  methodName: string;
  details: unknown;
  payerName: string | null;
  payerEmail: string | null;
  payerPhone: string | null;
  shippingAddress: PaymentAddress | null;
  shippingOption: string | null;
};

export type UsePaymentsOptions = {
  /**
   * Payment method data (e.g. basic-card, google-pay, etc.)
   */
  methodData: PaymentMethodData[];

  /**
   * Order details: total, display items, shipping options, etc.
   */
  details: PaymentDetailsInit;

  /**
   * Optional request options (requestPayerName, requestPayerEmail, etc.)
   */
  requestOptions?: PaymentOptions;
};

export type UsePaymentsResult = {
  supported: boolean;
  loading: boolean;
  result: PaymentResult | null;
  error: PaymentError | null;

  // actions
  show: () => Promise<PaymentResult>;
  clearResult: () => void;
  clearError: () => void;
};

function mapPaymentError(err: unknown): PaymentError {
  if (err instanceof DOMException) {
    if (err.name === 'AbortError') {
      return { code: 'ABORT_ERROR', message: err.message || 'Payment was aborted by the user.' };
    }
    if (err.name === 'NotAllowedError') {
      return { code: 'NOT_ALLOWED', message: err.message || 'Payment not allowed.' };
    }
    if (err.name === 'InvalidStateError') {
      return {
        code: 'INVALID_STATE',
        message: err.message || 'Payment request is in an invalid state.',
      };
    }
  }
  if (err instanceof Error) {
    return { code: 'UNKNOWN', message: err.message };
  }
  return { code: 'UNKNOWN', message: 'Unknown payment error.' };
}

function toPaymentResult(response: PaymentResponse): PaymentResult {
  return {
    requestId: response.requestId,
    methodName: response.methodName,
    details: response.details,
    payerName: response.payerName ?? null,
    payerEmail: response.payerEmail ?? null,
    payerPhone: response.payerPhone ?? null,
    shippingAddress: response.shippingAddress ?? null,
    shippingOption: response.shippingOption ?? null,
  };
}

export function usePayments(options: UsePaymentsOptions): UsePaymentsResult {
  const { methodData, details, requestOptions } = options;

  const supported = typeof window !== 'undefined' && typeof window.PaymentRequest !== 'undefined';

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<PaymentError | null>(
    supported
      ? null
      : {
          code: 'UNSUPPORTED',
          message: 'Payment Request API is not supported by this browser.',
        },
  );

  const clearError = useCallback(() => setError(null), []);
  const clearResult = useCallback(() => setResult(null), []);

  const show = useCallback((): Promise<PaymentResult> => {
    return new Promise(async (resolve, reject) => {
      if (!supported) {
        const e: PaymentError = {
          code: 'UNSUPPORTED',
          message: 'Payment Request API is not supported by this browser.',
        };
        setError(e);
        reject(e);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const request = new PaymentRequest(methodData, details, requestOptions);
        const response = await request.show();

        // Complete the payment — always report "success" to close the sheet
        await response.complete('success');

        const next = toPaymentResult(response);
        setResult(next);
        setLoading(false);
        resolve(next);
      } catch (err) {
        const mapped = mapPaymentError(err);
        setError(mapped);
        setLoading(false);
        reject(mapped);
      }
    });
  }, [supported, methodData, details, requestOptions]);

  return useMemo(
    () => ({
      supported,
      loading,
      result,
      error,
      show,
      clearResult,
      clearError,
    }),
    [supported, loading, result, error, show, clearResult, clearError],
  );
}

'use client';

import { usePayments } from '@/lib/hooks/webApi/usePayments';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const PaymentView = () => {
  const { supported, error, show } = usePayments({
    details: {
      total: {
        label: 'Test Purchase',
        amount: { currency: 'USD', value: '9.99' },
      },
    },
    methodData: [
      {
        supportedMethods: 'https://example.com/pay',
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex'],
        },
      },
    ],
  });

  return (
    <Column flexX="start" gap={4}>
      <Column flexY="start">
        <DataDisplay
          direction="row"
          label="Supported"
          labelWidth={100}
          value={supported ? 'Yes' : 'No'}
        />

        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={100} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={show}>
          Show Payment Request
        </IconButton>
      </Row>
    </Column>
  );
};

export default PaymentView;

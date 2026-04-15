'use client';

import { useVibration } from '@/lib/hooks/webApi/useVibration';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const VibrationView = () => {
  const { supported, error, vibrating, vibrate } = useVibration();

  return (
    <Column flexX="start" gap={4}>
      <Column flexY="start">
        <DataDisplay
          direction="row"
          label="Supported"
          labelWidth={100}
          value={supported ? 'Yes' : 'No'}
        />
        <DataDisplay
          direction="row"
          label="Vibrating"
          labelWidth={100}
          value={vibrating ? 'Yes' : 'No'}
        />

        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={100} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={() => vibrate(200)}>
          Vibrate
        </IconButton>
      </Row>
    </Column>
  );
};

export default VibrationView;

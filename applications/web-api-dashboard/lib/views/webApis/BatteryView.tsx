'use client';

import { useBaterry } from '@/lib/hooks/webApi/useBattery';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const BatteryView = () => {
  const { supported, error, battery, refresh } = useBaterry();

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
          label="Charging"
          labelWidth={100}
          value={battery ? (battery.charging ? 'Yes' : 'No') : 'N/A'}
        />
        <DataDisplay
          direction="row"
          label="Level"
          labelWidth={100}
          value={battery ? `${battery.level * 100}%` : 'N/A'}
        />
        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={100} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={refresh}>
          Refresh
        </IconButton>
      </Row>
    </Column>
  );
};

export default BatteryView;

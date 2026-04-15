'use client';

import { useBluetooth } from '@/lib/hooks/webApi/useBluethoot';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const BluethootView = () => {
  const { supported, error, findAndPair } = useBluetooth();

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
        <IconButton size="sm" iconType="reload" onClick={findAndPair}>
          Find and Pair
        </IconButton>

        <IconButton size="sm" iconType="map">
          Go to Google Maps
        </IconButton>
      </Row>
    </Column>
  );
};

export default BluethootView;

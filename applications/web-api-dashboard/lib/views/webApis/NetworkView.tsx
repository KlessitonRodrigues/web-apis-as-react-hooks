'use client';

import { useNetwork } from '@/lib/hooks/webApi/useNetwork';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const NetworkView = () => {
  const { supported, error, network, refresh } = useNetwork();

  return (
    <Column flexX="start" gap={4}>
      <Column flexY="start">
        <DataDisplay
          direction="row"
          label="Supported"
          labelWidth={140}
          value={supported ? 'Yes' : 'No'}
        />
        <DataDisplay
          direction="row"
          label="Online"
          labelWidth={140}
          value={network ? (network.online ? 'Yes' : 'No') : 'N/A'}
        />
        <DataDisplay
          direction="row"
          label="Effective Type"
          labelWidth={140}
          value={network?.effectiveType ?? 'N/A'}
        />
        <DataDisplay
          direction="row"
          label="Downlink (Mbps)"
          labelWidth={140}
          value={network?.downlink?.toString() ?? 'N/A'}
        />
        <DataDisplay
          direction="row"
          label="RTT (ms)"
          labelWidth={140}
          value={network?.rtt?.toString() ?? 'N/A'}
        />

        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={140} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={refresh}>
          Refresh
        </IconButton>

        <IconButton size="sm" iconType="map">
          Show Notification
        </IconButton>
      </Row>
    </Column>
  );
};

export default NetworkView;

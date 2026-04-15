'use client';

import { useNotification } from '@/lib/hooks/webApi/useNotification';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const NotificationView = () => {
  const { supported, error, permission, showNotification, requestPermission } = useNotification();

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
          label="Permission"
          labelWidth={100}
          value={String(permission).toUpperCase()}
        />
        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={100} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={requestPermission}>
          Request Permission
        </IconButton>

        <IconButton
          size="sm"
          iconType="map"
          onClick={() => showNotification('Hello!', { body: 'This is a notification.' })}
        >
          Show Notification
        </IconButton>
      </Row>
    </Column>
  );
};

export default NotificationView;

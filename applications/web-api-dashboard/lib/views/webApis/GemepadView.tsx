'use client';

import { useGamepad } from '@/lib/hooks/webApi/useGamepad';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';

const GamepadView = () => {
  const { supported, error, gamepads, refresh } = useGamepad();

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
          label="Gamepads"
          labelWidth={100}
          value={gamepads.length > 0 ? gamepads.map(gp => gp.id).join(', ') : 'None'}
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

export default GamepadView;

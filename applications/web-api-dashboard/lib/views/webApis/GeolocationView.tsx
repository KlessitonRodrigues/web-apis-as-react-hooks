'use client';

import { useGeolocation } from '@/lib/hooks/webApi/useGeolocation';
import { Column, DataDisplay, IconButton, Row } from '@packages/daisy-ui-components';
import Link from 'next/link';

const GeolocationView = () => {
  const { supported, coords, error, getCurrentPosition } = useGeolocation();

  return (
    <Column flexX="start" gap={4}>
      <Column>
        <DataDisplay
          direction="row"
          label="Supported"
          labelWidth={80}
          value={supported ? 'Yes' : 'No'}
        />
        <DataDisplay
          direction="row"
          label="Latitude"
          labelWidth={80}
          value={coords ? coords.latitude.toString() : 'N/A'}
        />
        <DataDisplay
          direction="row"
          label="Longitude"
          labelWidth={80}
          value={coords ? coords.longitude.toString() : 'N/A'}
        />
        {error && (
          <DataDisplay direction="row" label="Error" labelWidth={80} value={error.message} />
        )}
      </Column>
      <Row>
        <IconButton size="sm" iconType="reload" onClick={getCurrentPosition}>
          Refresh
        </IconButton>
        <Link
          href={`https://www.google.com/maps?q=${coords?.latitude},${coords?.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton size="sm" iconType="map">
            Go to Google Maps
          </IconButton>
        </Link>
      </Row>
    </Column>
  );
};

export default GeolocationView;

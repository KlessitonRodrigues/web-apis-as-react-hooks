import BatteryView from '@/lib/views/webApis/BatteryView';
import BluethootView from '@/lib/views/webApis/BluethootView';
import GamepadView from '@/lib/views/webApis/GemepadView';
import GeolocationView from '@/lib/views/webApis/GeolocationView';
import NetworkView from '@/lib/views/webApis/NetworkView';
import NotificationView from '@/lib/views/webApis/NotificationView';
import PaymentView from '@/lib/views/webApis/PaymentView';
import VibrationView from '@/lib/views/webApis/VibrationView';
import { Card, Page, Paper, Row, TitleIcon } from '@packages/daisy-ui-components';

export default function WebApiDashboardPage() {
  return (
    <Page>
      <Paper>
        <Row responsive="lg" flexY="stretch">
          <Card>
            <TitleIcon icon="brush" title="Geolocation API" />
            <GeolocationView />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Bluetooth API" />
            <BluethootView />
          </Card>
        </Row>
        <Row responsive="lg" flexY="stretch">
          <Card>
            <TitleIcon icon="brush" title="Notifications API" />
            <NotificationView />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Battery API" />
            <BatteryView />
          </Card>
        </Row>
        <Row responsive="lg" flexY="stretch">
          <Card>
            <TitleIcon icon="brush" title="Network Information API" />
            <NetworkView />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Payment Request API" />
            <PaymentView />
          </Card>
        </Row>
        <Row responsive="lg" flexY="stretch">
          <Card>
            <TitleIcon icon="brush" title="Vibration API" />
            <VibrationView />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Gamepad API" />
            <GamepadView />
          </Card>
        </Row>
      </Paper>
    </Page>
  );
}

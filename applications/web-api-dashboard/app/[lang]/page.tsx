import { Card, Page, Paper, Row, TitleIcon } from '@packages/daisy-ui-components';

export default function WebApiDashboardPage() {
  return (
    <Page>
      <Paper>
        <Row responsive="lg">
          <Card>
            <TitleIcon icon="brush" title="Geolocation API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Bluetooth API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Notifications API" />
          </Card>
        </Row>
        <Row responsive="lg">
          <Card>
            <TitleIcon icon="brush" title="Battery API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Network Information API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Payment Request API" />
          </Card>
        </Row>
        <Row responsive="lg">
          <Card>
            <TitleIcon icon="brush" title="Vibration API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Gamepad API" />
          </Card>
          <Card>
            <TitleIcon icon="brush" title="Telephony API" />
          </Card>
        </Row>
      </Paper>
    </Page>
  );
}

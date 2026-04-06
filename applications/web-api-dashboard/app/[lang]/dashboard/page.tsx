import { useServerTranslations } from '@/lib/hooks/useServerTranslation';
import { NEXTJS } from '@packages/common-types';
import {
  BarChartComponent,
  Column,
  LineChartComponent,
  Paper,
  PieChartComponent,
  RadarChartComponent,
  RadialChartComponent,
  Row,
} from '@packages/daisy-ui-components';

const fakeData = [
  {
    name: 'JAN',
    sellers: 400,
    resources: 240,
    profit: 240,
  },
  {
    name: 'FEB',
    sellers: 300,
    resources: 139,
    profit: 139,
  },
  {
    name: 'MAR',
    sellers: 200,
    resources: 480,
    profit: 229,
  },
  {
    name: 'APR',
    sellers: 278,
    resources: 390,
    profit: 390,
  },
  {
    name: 'MAY',
    sellers: 189,
    resources: 480,
    profit: 520,
  },
];

export default async function DashboardPage(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);

  return (
    <Column>
      <Row responsive="lg">
        <Paper>
          <BarChartComponent
            title={t('dashboard.barchart.title')}
            data={fakeData}
            yField="name"
            dataFields={['sellers', 'resources', 'profit']}
          />
        </Paper>
        <Paper>
          <BarChartComponent
            title={t('dashboard.barchart.title')}
            data={fakeData}
            xField="name"
            dataFields={['sellers', 'resources', 'profit']}
          />
        </Paper>
      </Row>
      <Row responsive="lg">
        <Paper>
          <LineChartComponent
            data={fakeData}
            xField="name"
            dataFields={['sellers', 'resources', 'profit']}
          />
        </Paper>
        <Paper>
          <PieChartComponent data={fakeData} nameField="name" dataField="sellers" />
        </Paper>
      </Row>
      <Row responsive="lg">
        <Paper>
          <RadarChartComponent
            data={fakeData}
            nameField="name"
            dataFields={['sellers', 'resources', 'profit']}
          />
        </Paper>
        <Paper>
          <RadialChartComponent data={fakeData} dataField="sellers" />
        </Paper>
      </Row>
    </Column>
  );
}

import { useServerTranslations } from '@/lib/hooks/useServerTranslation';
import TransactionsView from '@/lib/views/transactions/TransactionView';
import { NEXTJS } from '@packages/common-types';
import { Column, CurrencyCard, Paper, Row, TitleIcon } from '@packages/daisy-ui-components';

export default async function HomePage(props: NEXTJS.PageProps) {
  const { t } = await useServerTranslations(props);

  return (
    <Column>
      <Paper>
        <TitleIcon title={t('home.status.title')} icon="chart" />
        <Row responsive="lg" gap={4}>
          <CurrencyCard
            total={t('home.status.totalRevenue')}
            percentage={12.5}
            amount="$25,000"
            percentageClassName="text-green"
          />
          <CurrencyCard
            total={t('home.status.totalExpenses')}
            percentage={8.2}
            amount="$15,000"
            percentageClassName="text-red"
          />
          <CurrencyCard
            total={t('home.status.netProfit')}
            percentage={5.3}
            amount="$10,000"
            percentageClassName="text-green"
          />
          <CurrencyCard
            total={t('home.status.customerGrowth')}
            percentage={20.1}
            amount="1,200"
            percentageClassName="text-green"
          />
        </Row>
      </Paper>
      <Paper>
        <TitleIcon title={t('home.financial.title')} icon="currency" />
        <TransactionsView />
      </Paper>
    </Column>
  );
}

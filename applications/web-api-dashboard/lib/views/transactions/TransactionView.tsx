'use client';
import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import useTransactionsAPI from '@/lib/hooks/useTransactionsAPI';
import { Column, TabList } from '@packages/daisy-ui-components';

import TransactionsForm from './TransactionForm';
import TransactionsTable from './TransactionTable';

const TransactionsView = () => {
  const { t } = useClientTranslations();
  const { transactions, editId, setType, setDate, setEditId } = useTransactionsAPI();

  const handleSelectTab = (index: number) => {
    if (index === 0) setEditId(0);
  };

  return (
    <Column flexX="start">
      <TabList
        className="min-h-170"
        defaultItem={editId ? 1 : 0}
        onSelect={(_, i) => handleSelectTab(i)}
        items={[
          {
            label: t('tables.transactions.tab.all'),
            icon: 'list',
            content: (
              <TransactionsTable
                items={transactions}
                onSelect={item => setEditId(item.id)}
                onTypeChange={setType}
                onDateChange={setDate}
              />
            ),
          },
          {
            label: editId ? t('tables.transactions.tab.edit') : t('tables.transactions.tab.new'),
            icon: editId ? 'pencil' : 'plus',
            content: <TransactionsForm />,
          },
        ]}
      />
    </Column>
  );
};

export default TransactionsView;

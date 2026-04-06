import { useClientTranslations } from '@/lib/hooks/useClientTranslation';
import {
  Column,
  Icons,
  Pagination,
  Row,
  Selector,
  Table,
  TableProps,
} from '@packages/daisy-ui-components';
import { JSX, useMemo } from 'react';

interface TransactionsTableProps {
  items: any[];
  page?: number;
  lastPage?: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onTypeChange?: (type: string) => void;
  onDateChange?: (date: string) => void;
  onSelect?: (item: any) => void;
}

const typeIconMap: Record<string, JSX.Element> = {
  Revenue: <Icons iconType="upArrow" iconSize="1rem" className="text-success" />,
  Expense: <Icons iconType="downArrow" iconSize="1rem" className="text-error" />,
  Profit: <Icons iconType="currency" iconSize="1rem" />,
};

const getTableColumns = (t: any): TableProps['columns'] => [
  { label: t('tables.transactions.columns.name'), key: 'name' },
  {
    label: t('tables.transactions.columns.type'),
    key: 'type',
    render: (item: any) => typeIconMap[item.type],
  },
  {
    label: t('tables.transactions.columns.date'),
    key: 'date',
    responsive: 'sm',
  },
  {
    label: t('tables.transactions.columns.value'),
    key: 'value',
    render: (item: any) => `$ ${item.value.toFixed(2)}`,
  },
];

const getTypeOptions = (t: any) => [
  {
    label: t('tables.transactions.filters.type.allTransactions'),
    value: '',
  },
  {
    label: t('tables.transactions.filters.type.revenue'),
    value: 'Revenue',
  },
  {
    label: t('tables.transactions.filters.type.expense'),
    value: 'Expense',
  },
  {
    label: t('tables.transactions.filters.type.profit'),
    value: 'Profit',
  },
];

const getDateOptions = (t: any) => [
  {
    label: t('tables.transactions.filters.date.all'),
    value: 'all',
  },
  {
    label: t('tables.transactions.filters.date.last7Days'),
    value: 'last7Days',
  },
  {
    label: t('tables.transactions.filters.date.last30Days'),
    value: 'last30Days',
  },
  {
    label: t('tables.transactions.filters.date.thisMonth'),
    value: 'thisMonth',
  },
  {
    label: t('tables.transactions.filters.date.lastMonth'),
    value: 'lastMonth',
  },
];

const TransactionsTable = (props: TransactionsTableProps) => {
  const { t } = useClientTranslations();
  const { items, page, lastPage, isLoading, onPageChange, onSelect } = props;
  const transactionTable = useMemo(() => getTableColumns(t), [t]);
  const typeOptions = useMemo(() => getTypeOptions(t), [t]);
  const dateOptions = useMemo(() => getDateOptions(t), [t]);

  return (
    <Column flexX="start">
      <Row responsive="md" className="max-w-lg">
        <Selector
          label={t('tables.transactions.filters.type.title')}
          options={typeOptions}
          disabled={isLoading}
          onChange={props.onTypeChange}
        />
        <Selector
          label={t('tables.transactions.filters.date.title')}
          options={dateOptions}
          disabled={isLoading}
          onChange={props.onDateChange}
        />
      </Row>
      <Table isLoading={isLoading} columns={transactionTable} items={items} onSelect={onSelect} />
      <Pagination currentPage={page} lastPage={lastPage} onPageChange={onPageChange} />
    </Column>
  );
};

export default TransactionsTable;

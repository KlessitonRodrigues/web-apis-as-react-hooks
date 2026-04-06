import { useEffect, useState } from 'react';

const mockData = [
  {
    id: '1',
    name: 'Acme Corp',
    date: '12/01/2025',
    type: 'Revenue',
    value: 12344,
  },
  {
    id: '2',
    name: 'Tech Solutions',
    date: '12/01/2025',
    type: 'Expense',
    value: 12344,
  },
  {
    id: '3',
    name: 'Global Industries',
    date: '12/01/2025',
    type: 'Profit',
    value: 12344,
  },
  {
    id: '4',
    name: 'Nexus Labs',
    date: '12/01/2025',
    type: 'Revenue',
    value: 12344,
  },
  {
    id: '5',
    name: 'Vertex Capital',
    date: '12/01/2025',
    type: 'Expense',
    value: 12344,
  },
  {
    id: '6',
    name: 'Prime Analytics',
    date: '12/01/2025',
    type: 'Profit',
    value: 12344,
  },
  {
    id: '7',
    name: 'Summit Trading',
    date: '12/01/2025',
    type: 'Revenue',
    value: 12344,
  },
  {
    id: '8',
    name: 'Quantum Ventures',
    date: '12/01/2025',
    type: 'Expense',
    value: 12344,
  },
  {
    id: '9',
    name: 'Stellar Digital',
    date: '12/01/2025',
    type: 'Profit',
    value: 12344,
  },
  {
    id: '10',
    name: 'Horizon Financial',
    date: '12/01/2025',
    type: 'Revenue',
    value: 12344,
  },
];

const useTransactionsAPI = () => {
  const [transactions, setTransactions] = useState(mockData);
  const [type, setType] = useState('All');
  const [date, setDate] = useState('All');
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    if (!type || type === 'All') setTransactions(mockData);
    else setTransactions(mockData.filter(item => item.type === type));
  }, [type]);

  return { transactions, type, date, editId, setType, setDate, setEditId };
};

export default useTransactionsAPI;

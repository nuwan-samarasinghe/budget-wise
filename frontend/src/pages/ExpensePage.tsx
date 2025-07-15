import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS, getTwoRandomItems, shuffleArray } from '../commons/GraphsUtil';

type ExpenseRecord = {
  amount: number;
  source: string;
  note?: string;
  category: string;
};

const initialExpenseData: ExpenseRecord[] = [
  {
    amount: 400,
    source: 'Rent',
    note: 'Monthly flat rent',
    category: 'Housing',
  },
  {
    amount: 120,
    source: 'Groceries',
    note: 'Weekly groceries',
    category: 'Food',
  },
  {
    amount: 80,
    source: 'Netflix',
    note: 'Streaming service',
    category: 'Leisure',
  },
  {
    amount: 60,
    source: 'Uber',
    note: 'Weekend transport',
    category: 'Transport',
  },
  {
    amount: 90,
    source: 'Electricity',
    note: 'Monthly bill',
    category: 'Bills',
  },
  { amount: 50, source: 'Gym', note: 'Membership fee', category: 'Health' },
];

// Graph Data
const monthlyExpenseTrend = [
  { name: 'Week 1', amount: 200 },
  { name: 'Week 2', amount: 250 },
  { name: 'Week 3', amount: 180 },
  { name: 'Week 4', amount: 300 },
];

const yearlyExpenseTrend = [
  { name: 'Jan', amount: 1800 },
  { name: 'Feb', amount: 1700 },
  { name: 'Mar', amount: 1650 },
  { name: 'Apr', amount: 1900 },
  { name: 'May', amount: 2000 },
  { name: 'Jun', amount: 2100 },
];

export default function ExpensePage() {
  const [filters, setFilters] = useState({
    amount: '',
    source: '',
    note: '',
    category: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const shuffledColors = useMemo(() => shuffleArray(COLORS), [yearlyExpenseTrend.length]);
  const [fixedColor, variableColor] = getTwoRandomItems(shuffledColors);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const filteredData = initialExpenseData.filter((record) => {
    return (
      record.amount.toString().includes(filters.amount) &&
      record.source.toLowerCase().includes(filters.source.toLowerCase()) &&
      (record.note?.toLowerCase().includes(filters.note.toLowerCase()) ??
        true) &&
      record.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Last Month */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">
              Last Month Expense
            </span>
            <span className="text-red-600 font-semibold">£930</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={monthlyExpenseTrend}>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={fixedColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* This Year */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">
              This Year Expense
            </span>
            <span className="text-red-600 font-semibold">£11,150</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={yearlyExpenseTrend}>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={variableColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          color="primary"
          className="!rounded-xl !bg-brand-600 hover:!bg-brand-700"
        >
          + Add Expense
        </Button>
      </div>

      {/* Table with Filters */}
      <Paper elevation={3} className="rounded-2xl overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>
                <TextField
                  label="Amount"
                  variant="standard"
                  size="small"
                  value={filters.amount}
                  onChange={(e) => handleFilterChange('amount', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Source"
                  variant="standard"
                  size="small"
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Note"
                  variant="standard"
                  size="small"
                  value={filters.note}
                  onChange={(e) => handleFilterChange('note', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Category"
                  variant="standard"
                  size="small"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-gray-700">
                Amount
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Source
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Note
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Category
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell className="text-red-600 font-medium">
                    £{item.amount.toLocaleString('en-GB')}
                  </TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.note || '-'}</TableCell>
                  <TableCell>{item.category}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-4"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </div>
  );
}

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
import { useState } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type BudgetRecord = {
  amount: number;
  source: string;
  note?: string;
  category: string;
};

const initialBudgetData: BudgetRecord[] = [
  { amount: 500, source: 'Monthly Plan', note: 'Rent budget', category: 'Housing' },
  { amount: 200, source: 'Monthly Plan', note: 'Groceries', category: 'Food' },
  { amount: 100, source: 'Savings Plan', note: 'Emergency fund', category: 'Savings' },
  { amount: 150, source: 'Entertainment', note: 'Streaming, movies', category: 'Leisure' },
  { amount: 250, source: 'Transport', note: 'Fuel + Maintenance', category: 'Transport' },
  { amount: 300, source: 'Utilities', note: 'Electricity, Water, Gas', category: 'Bills' },
];

// Graph Data
const monthlyBudgetTrend = [
  { name: 'Week 1', amount: 100 },
  { name: 'Week 2', amount: 200 },
  { name: 'Week 3', amount: 180 },
  { name: 'Week 4', amount: 220 },
];

const yearlyBudgetTrend = [
  { name: 'Jan', amount: 1000 },
  { name: 'Feb', amount: 1200 },
  { name: 'Mar', amount: 950 },
  { name: 'Apr', amount: 1300 },
  { name: 'May', amount: 1100 },
  { name: 'Jun', amount: 1250 },
];

export default function BudgetPage() {
  const [filters, setFilters] = useState({ amount: '', source: '', note: '', category: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const filteredData = initialBudgetData.filter((record) => {
    return (
      record.amount.toString().includes(filters.amount) &&
      record.source.toLowerCase().includes(filters.source.toLowerCase()) &&
      (record.note?.toLowerCase().includes(filters.note.toLowerCase()) ?? true) &&
      record.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budget Planner</h1>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Last Month Budget */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Last Month Budget</span>
            <span className="text-blue-700 font-semibold">£700</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={monthlyBudgetTrend}>
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#0288D1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* This Year Budget */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">This Year Budget</span>
            <span className="text-blue-700 font-semibold">£6,800</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={yearlyBudgetTrend}>
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#6A5ACD" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Budget Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          color="primary"
          className="!rounded-xl !bg-brand-600 hover:!bg-brand-700"
        >
          + Add Budget
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
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-gray-700">Amount</TableCell>
              <TableCell className="font-semibold text-gray-700">Source</TableCell>
              <TableCell className="font-semibold text-gray-700">Note</TableCell>
              <TableCell className="font-semibold text-gray-700">Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell className="text-blue-800 font-medium">
                    £{item.amount.toLocaleString('en-GB')}
                  </TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.note || '-'}</TableCell>
                  <TableCell>{item.category}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
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

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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type IncomeRecord = {
  amount: number;
  source: string;
  note?: string;
};

const initialIncomeData: IncomeRecord[] = [
  { amount: 1200, source: 'Salary', note: 'June payment' },
  { amount: 200, source: 'Freelancing', note: 'Logo design' },
  { amount: 50, source: 'Interest', note: 'Bank savings' },
  { amount: 100, source: 'Gift', note: 'Birthday gift' },
  { amount: 90, source: 'Interest', note: 'Quarterly interest' },
  { amount: 400, source: 'Bonus', note: 'Quarterly bonus' },
];

const monthlyTrend = [
  { name: 'Week 1', amount: 300 },
  { name: 'Week 2', amount: 400 },
  { name: 'Week 3', amount: 250 },
  { name: 'Week 4', amount: 550 },
];

const yearlyTrend = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 4200 },
  { name: 'Mar', amount: 4100 },
  { name: 'Apr', amount: 4300 },
  { name: 'May', amount: 4500 },
  { name: 'Jun', amount: 4700 },
  { name: 'Jul', amount: 4800 },
];

export default function IncomePage() {
  const [filters, setFilters] = useState({ amount: '', source: '', note: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const filteredData = initialIncomeData.filter((record) => {
    return (
      record.amount.toString().includes(filters.amount) &&
      record.source.toLowerCase().includes(filters.source.toLowerCase()) &&
      (record.note?.toLowerCase().includes(filters.note.toLowerCase()) ?? true)
    );
  });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Income</h1>
      </div>

      {/* Charts (Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Last Month */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">Last Month</span>
            <span className="text-green-700 font-semibold">£1,500</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={monthlyTrend}>
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#3B7A57" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* This Year */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">This Year</span>
            <span className="text-green-700 font-semibold">£29,800</span>
          </div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={yearlyTrend}>
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#6A5ACD" strokeWidth={2} dot={false} />
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
          + Add Income
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
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-gray-700">Amount</TableCell>
              <TableCell className="font-semibold text-gray-700">Source</TableCell>
              <TableCell className="font-semibold text-gray-700">Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell className="text-green-700 font-medium">
                    £{item.amount.toLocaleString('en-GB')}
                  </TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.note || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
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

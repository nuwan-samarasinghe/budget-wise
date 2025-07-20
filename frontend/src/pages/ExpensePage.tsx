import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS, formatCurrency, getTwoRandomItems, shuffleArray } from '../commons/GraphsUtil';
import ExpenseDialog from '../components/ExpenseDialogBox';
import { fetchExpense, fetchMonthlyExpense, fetchYearlyExpense, insertExpense } from '../feature/expense/expenseSlice';
import type { Expense } from '../feature/expense/expenseTypes';
import { useAppDispatch, useAppSelector } from '../hooks';

export default function ExpensePage() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    amount: '',
    source: '',
    note: '',
    category: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchExpense());
    dispatch(fetchMonthlyExpense());
    dispatch(fetchYearlyExpense());
  }, [dispatch]);

  const expenseData = useAppSelector((state) => state.expense);

  const shuffledColors = useMemo(
    () => shuffleArray(COLORS),
    [expenseData.yearlyExpenseSummmary.length],
  );
  const [fixedColor, variableColor] = getTwoRandomItems(shuffledColors);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const filteredData = expenseData.expenses.filter((record) => {
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Expense | null>(
    null,
  );

  const handleEdit = (row: Expense) => {
    setSelectedBudget(row);
    setDialogOpen(true);
  };

  return (
    <>
      <Backdrop open={expenseData.loading} sx={{ zIndex: 1300, color: '#fff' }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Loading income data...</Typography>
      </Backdrop>
      <ExpenseDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBudget(null);
        }}
        onSave={(data) => {
          dispatch(insertExpense(data))
          dispatch(fetchMonthlyExpense());
          dispatch(fetchYearlyExpense());
        }}
        initialData={selectedBudget}
      />
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
              <span className="text-red-700 font-semibold">{formatCurrency(expenseData.monthlyExpenseSummmary.reduce(
                (sum, entry) => sum + entry.amount,
                0
              ))}</span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={expenseData.monthlyExpenseSummmary}>
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
              <span className="text-red-700 font-semibold">{formatCurrency(expenseData.yearlyExpenseSummmary.reduce(
                (sum, entry) => sum + entry.amount,
                0
              ))}</span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={expenseData.yearlyExpenseSummmary}>
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
            className="!rounded-xl !bg-red-600 hover:!bg-red-700"
            onClick={() => setDialogOpen(true)}
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
                    onChange={(e) =>
                      handleFilterChange('amount', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Source"
                    variant="standard"
                    size="small"
                    value={filters.source}
                    onChange={(e) =>
                      handleFilterChange('source', e.target.value)
                    }
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
                paginatedData.map((item) => (
                  <TableRow key={item.id} hover onClick={() => handleEdit(item)}>
                    <TableCell className="text-brand-700 font-medium">
                      {formatCurrency(item.amount)}
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
    </>
  );
}

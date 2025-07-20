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
import BudgetDialog from '../components/BudgetDialogBox';
import { fetchBudget, fetchMonthlyBudget, fetchYearlyBudget, insertBudget } from '../feature/budget/budgetSlice';
import type { Budget } from '../feature/budget/budgetTypes';
import { useAppDispatch, useAppSelector } from '../hooks';

export default function BudgetPage() {
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
    dispatch(fetchBudget());
    dispatch(fetchMonthlyBudget());
    dispatch(fetchYearlyBudget());
  }, [dispatch]);

  const budgetData = useAppSelector((state) => state.budget);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const filteredData = budgetData.budgets.filter((record) => {
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

  const shuffledColors = useMemo(
    () => shuffleArray(COLORS),
    [budgetData.yearlyBudgetSummmary.length],
  );
  const [fixedColor, variableColor] = getTwoRandomItems(shuffledColors);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(
    null,
  );

  const handleEdit = (row: Budget) => {
    setSelectedBudget(row);
    setDialogOpen(true);
  };

  return (
    <>
      <Backdrop open={budgetData.loading} sx={{ zIndex: 1300, color: '#fff' }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Loading income data...</Typography>
      </Backdrop>
      <BudgetDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBudget(null);
        }}
        onSave={(data) => {
          dispatch(insertBudget(data))
          dispatch(fetchMonthlyBudget());
          dispatch(fetchYearlyBudget());
        }}
        initialData={selectedBudget}
      />
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
              <span className="text-sm font-medium text-gray-600">
                Monthly Budget Trend
              </span>
              <span className="text-brand-700 font-semibold">{formatCurrency(budgetData.monthlyBudgetSummmary.reduce(
                (sum, entry) => sum + entry.amount,
                0
              ))}</span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={budgetData.monthlyBudgetSummmary}>
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

          {/* This Year Budget */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                Yearly Trend
              </span>
              <span className="text-brand-700 font-semibold">{formatCurrency(budgetData.yearlyBudgetSummmary.reduce(
                (sum, entry) => sum + entry.amount,
                0
              ))}</span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={budgetData.yearlyBudgetSummmary}>
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

        {/* Add Budget Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="contained"
            color="primary"
            className="!rounded-xl !bg-brand-600 hover:!bg-brand-700"
            onClick={() => setDialogOpen(true)}
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

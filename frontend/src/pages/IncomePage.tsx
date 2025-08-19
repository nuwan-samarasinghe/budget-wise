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
import {
  COLORS,
  formatCurrency,
  getTwoRandomItems,
  shuffleArray,
} from '../commons/GraphsUtil';
import IncomeDialog from '../components/IncomeDialogBox';
import {
  deleteIncome,
  fetchIncome,
  fetchMonthlyYearlyIncomeSummary,
  insertIncome,
} from '../feature/income/incomeSlice';
import type { Income } from '../feature/income/incomeTypes';
import { useAppDispatch, useAppSelector } from '../hooks';

export default function IncomePage() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    amount: '',
    source: '',
    note: '',
    incomeMonth: '',
    incomeType: '',
    recurrent: false,
    fromDate: '',
    toDate: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    refresh();
  }, [dispatch]);

  const incomeData = useAppSelector((state) => state.income);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const shuffledColors = useMemo(
    () => shuffleArray(COLORS),
    [incomeData.yearlyIncomeSummmary.length],
  );
  const [fixedColor, variableColor] = getTwoRandomItems(shuffledColors);

  const filteredData = incomeData.incomes.filter((record) => {
    return (
      record.amount.toString().includes(filters.amount) &&
      record.source.toLowerCase().includes(filters.source.toLowerCase()) &&
      (record.note?.toLowerCase().includes(filters.note.toLowerCase()) ?? true)
    );
  });

  const refresh = () => {
    dispatch(fetchIncome());
    dispatch(fetchMonthlyYearlyIncomeSummary());
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const handleEdit = (row: Income) => {
    setSelectedIncome(row);
    setDialogOpen(true);
  };

  return (
    <>
      <Backdrop open={incomeData.loading} sx={{ zIndex: 1300, color: '#fff' }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Loading income data...</Typography>
      </Backdrop>
      <IncomeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedIncome(null);
        }}
        onSave={async (data: Income) => {
          await dispatch(insertIncome(data)).unwrap();
          refresh();
          setDialogOpen(false);
          setSelectedIncome(null);
        }}
        onDelete={async (data: Income) => {
          await dispatch(deleteIncome(data)).unwrap();
          refresh();
          setDialogOpen(false);
          setSelectedIncome(null);
        }}
        initialData={selectedIncome}
      />
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
              <span className="text-sm font-medium text-gray-600">
                Monthly Income Trend
              </span>
              <span className="text-green-700 font-semibold">
                {formatCurrency(
                  incomeData.monthlyIncomeSummmary.reduce(
                    (sum, entry) => sum + entry.amount,
                    0,
                  ),
                )}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={incomeData.monthlyIncomeSummmary}>
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
                Yearly Trend
              </span>
              <span className="text-green-700 font-semibold">
                {formatCurrency(
                  incomeData.yearlyIncomeSummmary.reduce(
                    (sum, entry) => sum + entry.amount,
                    0,
                  ),
                )}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={incomeData.yearlyIncomeSummmary}>
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
            className="!rounded-xl !bg-green-600 hover:!bg-green-700"
            onClick={() => setDialogOpen(true)}
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
                    label="Income Month"
                    variant="standard"
                    size="small"
                    value={filters.incomeMonth}
                    onChange={(e) => handleFilterChange('incomeMonth', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Income Type"
                    variant="standard"
                    size="small"
                    value={filters.incomeType}
                    onChange={(e) => handleFilterChange('incomeType', e.target.value)}
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
                  Income Month
                </TableCell>
                <TableCell className="font-semibold text-gray-700">
                  Income Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    onClick={() => handleEdit(item)}
                    className="cursor-pointer"
                  >
                    <TableCell className="text-green-700 font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell>{item.source}</TableCell>
                    <TableCell>{item.note || '-'}</TableCell>
                    <TableCell>{item.incomeMonth || '-'}</TableCell>
                    <TableCell>{item.incomeType || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
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

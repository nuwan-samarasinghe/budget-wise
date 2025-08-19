'use client';

import { useEffect, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import {
  COLORS,
  formatCurrency,
  getTwoRandomItems,
  shuffleArray,
} from '../commons/GraphsUtil';
import { dashboard } from '../feature/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export default function HomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(dashboard());
  }, [dispatch]);

  const dashboardData = useAppSelector((state) => state.dashboard);

  const shuffledColors = useMemo(
    () => shuffleArray(COLORS),
    [dashboardData.dashboard.topExpenses.length],
  );
  const [fixedColor, variableColor] = getTwoRandomItems(shuffledColors);

  return (
    <div className="p-4">
      {/* Dashboard Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
      </div>

      <div className="space-y-6 p-4">
        {/* Row 1: Top Expenses + Monthly Line Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 5 Expense Categories */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Top 5 Expense Categories
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                layout="vertical"
                data={dashboardData.dashboard.topExpenses}
              >
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="category" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount">
                  {dashboardData.dashboard.topExpenses.map((_, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={shuffledColors[index % shuffledColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Income vs Expense (Line Chart) */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Monthly Income vs Expense
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.dashboard.montlyIncomeAndExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={fixedColor}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke={variableColor}
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Fixed vs Variable + Cash Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fixed vs Variable Expenses */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Fixed vs Variable Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.dashboard.fixedVariableIncomes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar
                  dataKey="fixed"
                  stackId="a"
                  fill={fixedColor}
                  name="Fixed"
                />
                <Bar
                  dataKey="variable"
                  stackId="a"
                  fill={variableColor}
                  name="Variable"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Over Time */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Cash Flow Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.dashboard.montlyIncomeAndExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="income" fill={fixedColor} name="Income" />
                <Bar dataKey="expense" fill={variableColor} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Budget vs Spent + Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget vs Spent Pie Chart */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Budget vs Spent
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.dashboard.budgetAndExpense}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value)}`
                  }
                  dataKey="value"
                >
                  {dashboardData.dashboard.budgetAndExpense.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={shuffledColors[index % shuffledColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Category Breakdown */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">
              Expense by Category
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.dashboard.expenseCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) =>
                    `${name}: ${formatCurrency(value)}`
                  }
                >
                  {dashboardData.dashboard.expenseCategories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={shuffledColors[index % shuffledColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 4: Recurring Subscriptions Table */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <Typography variant="h6" className="mb-2">
            Recurring Subscriptions
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Service</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.dashboard.recurringSubscriptions.map(
                  (item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.note}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

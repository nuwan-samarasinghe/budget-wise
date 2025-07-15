'use client';

import { useMemo } from 'react';
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
  Typography
} from '@mui/material';

import {
  COLORS,
  formatCurrency,
  getTwoRandomItems,
  shuffleArray,
} from '../commons/GraphsUtil';

export default function HomePage() {
  const monthlyData = [
    { month: 'Jan', income: 5000, expense: 3200 },
    { month: 'Feb', income: 5200, expense: 3100 },
    { month: 'Mar', income: 4800, expense: 3400 },
    { month: 'Apr', income: 5300, expense: 4000 },
    { month: 'May', income: 5500, expense: 4200 },
  ];

  const budgetData = [
    { name: 'Budget', value: 5000 },
    { name: 'Spent', value: 4200 },
  ];

  const expenseCategories = [
    { name: 'Rent', value: 1500 },
    { name: 'Groceries', value: 900 },
    { name: 'Utilities', value: 400 },
    { name: 'Entertainment', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Misc', value: 700 },
  ];

  const topExpenses = [
    { category: 'Rent', amount: 1500 },
    { category: 'Groceries', amount: 900 },
    { category: 'Utilities', amount: 400 },
    { category: 'Entertainment', amount: 400 },
    { category: 'Transport', amount: 300 },
  ];

  const recurringSubscriptions = [
    { name: 'Netflix', amount: 12.99, category: 'Entertainment' },
    { name: 'Spotify', amount: 9.99, category: 'Music' },
    { name: 'Gym Membership', amount: 35.0, category: 'Fitness' },
    { name: 'iCloud Storage', amount: 2.49, category: 'Storage' },
  ];

  const fixedVsVariable = [
    { month: 'Jan', fixed: 1800, variable: 1400 },
    { month: 'Feb', fixed: 1800, variable: 1300 },
    { month: 'Mar', fixed: 1800, variable: 1600 },
    { month: 'Apr', fixed: 1800, variable: 2200 },
    { month: 'May', fixed: 1800, variable: 2400 },
  ];

  const shuffledColors = useMemo(() => shuffleArray(COLORS), [topExpenses.length]);
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
            <Typography variant="h6" className="mb-2">Top 5 Expense Categories</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={topExpenses}>
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="category" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount">
                  {topExpenses.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={shuffledColors[index % shuffledColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Income vs Expense (Line Chart) */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">Monthly Income vs Expense</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke={fixedColor} name="Income" />
                <Line type="monotone" dataKey="expense" stroke={variableColor} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Fixed vs Variable + Cash Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fixed vs Variable Expenses */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">Fixed vs Variable Expenses</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fixedVsVariable}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="fixed" stackId="a" fill={fixedColor} name="Fixed" />
                <Bar dataKey="variable" stackId="a" fill={variableColor} name="Variable" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Over Time */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">Cash Flow Over Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
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
            <Typography variant="h6" className="mb-2">Budget vs Spent</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  dataKey="value"
                >
                  {budgetData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={shuffledColors[index % shuffledColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Category Breakdown */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <Typography variant="h6" className="mb-2">Expense by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {expenseCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={shuffledColors[index % shuffledColors.length]} />
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
          <Typography variant="h6" className="mb-2">Recurring Subscriptions</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Service</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recurringSubscriptions.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

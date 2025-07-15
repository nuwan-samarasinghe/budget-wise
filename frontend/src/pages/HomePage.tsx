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
    { name: 'Netflix', amount: 12.99 },
    { name: 'Spotify', amount: 9.99 },
    { name: 'Gym Membership', amount: 35.0 },
    { name: 'iCloud Storage', amount: 2.49 },
  ];

  const fixedVsVariable = [
    { month: 'Jan', fixed: 1800, variable: 1400 },
    { month: 'Feb', fixed: 1800, variable: 1300 },
    { month: 'Mar', fixed: 1800, variable: 1600 },
    { month: 'Apr', fixed: 1800, variable: 2200 },
    { month: 'May', fixed: 1800, variable: 2400 },
  ];

  const COLORS = [
    '#6A5ACD',
    '#4DB6AC',
    '#BA68C8',
    '#FFD54F',
    '#FF8A65',
    '#90CAF9',
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="p-4">
      {/* Dashboard Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Top 5 Expense Categories
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={topExpenses}>
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis type="category" dataKey="category" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount">
                {topExpenses.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recurring Subscriptions Table */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Recurring Subscriptions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-2">Service</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recurringSubscriptions.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed vs Variable Expenses Chart */}
        <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">
            Fixed vs Variable Expenses
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fixedVsVariable}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="fixed" stackId="a" fill="#4A4A4A" name="Fixed" />
              <Bar
                dataKey="variable"
                stackId="a"
                fill="#A0522D"
                name="Variable"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expense Line Chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Monthly Income vs Expense
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#3B7A57"
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#8B0000"
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Spent Pie Chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Budget vs Spent</h2>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow Bar Chart */}
        <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Cash Flow Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="income" fill="#3B7A57" name="Income" />
              <Bar dataKey="expense" fill="#8B0000" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {expenseCategories.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

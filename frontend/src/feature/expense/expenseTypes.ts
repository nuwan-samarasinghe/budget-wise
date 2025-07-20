export type Expense = {
  id: string;
  amount: number;
  source: string;
  note?: string;
  category: string;
};

export type MonthlyExpenseSummary = {
  month: string;
  amount: number;
};

export type YearlyExpenseSummary = {
  year: string;
  amount: number;
};

export type ExpenseState = {
  expenses: Expense[];
  monthlyExpenseSummmary: MonthlyExpenseSummary[];
  yearlyExpenseSummmary: YearlyExpenseSummary[];
  loading: boolean;
  error: string | null;
};

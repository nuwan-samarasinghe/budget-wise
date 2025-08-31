import type { Category } from "../category/categoryTypes";

export type Budget = {
  id: string;
  amount: number;
  note?: string;
  affectOn: string;
  budgetMonth: string;
  recurrent: boolean;
  fromDate?: string;
  toDate?: string;
  category: Category;
};

export type MonthlyBudgetSummary = {
  month: string;
  amount: number;
};

export type YearlyBudgetSummary = {
  year: string;
  amount: number;
};

export type BudgetState = {
  budgets: Budget[];
  monthlyBudgetSummary: MonthlyBudgetSummary[];
  yearlyBudgetSummary: YearlyBudgetSummary[];
  loading: boolean;
  error: string | null;
};

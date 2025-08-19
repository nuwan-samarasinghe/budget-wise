export type IncomeType = "SALARY" | "WIFE_INCOME";

export type Income = {
  id?: string;
  amount: number;
  source: string;
  note?: string;
  incomeMonth: string;
  incomeType: IncomeType;
  recurrent: boolean;
  fromDate?: string;
  toDate?: string;
};

export type MonthlyIncomeSummary = {
  month: string;
  amount: number;
};

export type YearlyIncomeSummary = {
  year: string;
  amount: number;
};

export type IncomeState = {
  incomes: Income[];
  monthlyIncomeSummmary: MonthlyIncomeSummary[];
  yearlyIncomeSummmary: YearlyIncomeSummary[];
  loading: boolean;
  error: string | null;
};

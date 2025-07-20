export type Budget = {
    id: string;
    amount: number;
    source: string;
    note?: string;
    category: string;
};

export type MonthlyBudgetSummary = {
    month: string,
    amount: number
}

export type YearlyBudgetSummary = {
    year: string,
    amount: number
}

export type BudgetState = {
    budgets: Budget[];
    monthlyBudgetSummmary: MonthlyBudgetSummary[];
    yearlyBudgetSummmary: YearlyBudgetSummary[];
    loading: boolean;
    error: string | null;
}
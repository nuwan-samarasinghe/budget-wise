export type MonthlyIncomeAndExpense = {
    month: string;
    income: number;
    expense: number;
};

export type BudgetAndExpense = {
    name: "Budget" | "Spent"
    value: number
}

export type ExpenseVsCategories = {
    category: string;
    value: number;
};

export type TopExpense = {
    category: string;
    value: number;
};

export type RecurringSubscriptions = {
    category: string;
    amount: number;
    note: string;
};

export type FixedVsVariableIncome = {
    month: string;
    fixed: number;
    variable: number;
}

export type Dashboard = {
    montlyIncomeAndExpenses: MonthlyIncomeAndExpense[];
    budgetAndExpense: BudgetAndExpense[]
    expenseCategories: ExpenseVsCategories[]
    topExpenses: TopExpense[]
    recurringSubscriptions: RecurringSubscriptions[]
    fixedVariableIncomes: FixedVsVariableIncome[]
}

export type DashboardState = {
    dashboard: Dashboard;
    loading: boolean;
    error: string | null;
};

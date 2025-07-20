import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Expense, ExpenseState } from './expenseTypes';

const initialState: ExpenseState = {
    expenses: [],
    monthlyExpenseSummmary: [],
    yearlyExpenseSummmary: [],
    loading: false,
    error: null,
};

export const fetchExpense = createAsyncThunk('expense/fetch', async () => {
    await new Promise((res) => setTimeout(res, 500));
    return [
        {
            id: crypto.randomUUID(),
            amount: 400,
            source: 'Rent',
            note: 'Monthly flat rent',
            category: 'Housing',
        },
        {
            id: crypto.randomUUID(),
            amount: 120,
            source: 'Groceries',
            note: 'Weekly groceries',
            category: 'Food',
        },
        {
            id: crypto.randomUUID(),
            amount: 80,
            source: 'Netflix',
            note: 'Streaming service',
            category: 'Leisure',
        },
        {
            id: crypto.randomUUID(),
            amount: 60,
            source: 'Uber',
            note: 'Weekend transport',
            category: 'Transport',
        },
        {
            id: crypto.randomUUID(),
            amount: 90,
            source: 'Electricity',
            note: 'Monthly bill',
            category: 'Bills',
        },
        {
            id: crypto.randomUUID(),
            amount: 50,
            source: 'Gym',
            note: 'Membership fee',
            category: 'Health',
        },
    ];

});

export const insertExpense = createAsyncThunk('expense/insert', async (expense: Expense) => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    if (!expense.id) {
        expense.id = crypto.randomUUID();
    }
    return expense;
});

export const fetchMonthlyExpense = createAsyncThunk('expense/fetchMonthly', async () => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    return [
        { month: 'Jan', amount: 4000 },
        { month: 'Feb', amount: 4200 },
        { month: 'Mar', amount: 4100 },
        { month: 'Apr', amount: 4300 },
        { month: 'May', amount: 4500 },
        { month: 'Jun', amount: 4700 },
        { month: 'Jul', amount: 4800 },
    ];
});

export const fetchYearlyExpense = createAsyncThunk('expense/fetchYearly', async () => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    return [
        { year: '2023', amount: 4000 },
        { year: '2024', amount: 4200 },
        { year: '2025', amount: 4100 },
    ];
});

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpense.fulfilled, (state, action) => {
                state.expenses = action.payload;
                state.loading = false;
            })
            .addCase(fetchExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch expense details';
            })
            .addCase(fetchMonthlyExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonthlyExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyExpenseSummmary = action.payload;
            })
            .addCase(fetchMonthlyExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch monthly expense details';
            })
            .addCase(fetchYearlyExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchYearlyExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.yearlyExpenseSummmary = action.payload;
            })
            .addCase(fetchYearlyExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch yearly expense details';
            })
            .addCase(insertExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
                state.loading = false;
                const index = state.expenses.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.expenses[index] = action.payload;
                } else {
                    state.expenses.push(action.payload);
                }
            })
            .addCase(insertExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to insert expense details';
            });
    },
});

export default expenseSlice.reducer;

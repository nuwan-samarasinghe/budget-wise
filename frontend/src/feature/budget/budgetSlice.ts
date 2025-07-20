import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Budget, BudgetState } from './budgetTypes';

const initialState: BudgetState = {
  budgets: [],
  monthlyBudgetSummmary: [],
  yearlyBudgetSummmary: [],
  loading: false,
  error: null,
};

export const fetchBudget = createAsyncThunk('budget/fetch', async () => {
  await new Promise((res) => setTimeout(res, 500));
  return [
    {
      id: crypto.randomUUID(),
      amount: 500,
      source: 'Monthly Plan',
      note: 'Rent budget',
      category: 'Housing',
    },
    {
      id: crypto.randomUUID(),
      amount: 200,
      source: 'Monthly Plan',
      note: 'Groceries',
      category: 'Food',
    },
    {
      id: crypto.randomUUID(),
      amount: 100,
      source: 'Savings Plan',
      note: 'Emergency fund',
      category: 'Savings',
    },
    {
      id: crypto.randomUUID(),
      amount: 150,
      source: 'Entertainment',
      note: 'Streaming, movies',
      category: 'Leisure',
    },
    {
      id: crypto.randomUUID(),
      amount: 250,
      source: 'Transport',
      note: 'Fuel + Maintenance',
      category: 'Transport',
    },
    {
      id: crypto.randomUUID(),
      amount: 300,
      source: 'Utilities',
      note: 'Electricity, Water, Gas',
      category: 'Bills',
    },
  ];
});

export const insertBudget = createAsyncThunk(
  'budget/insert',
  async (budget: Budget) => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    if (!budget.id) {
      budget.id = crypto.randomUUID();
    }
    return budget;
  },
);

export const fetchMonthlyBudget = createAsyncThunk(
  'budget/fetchMonthly',
  async () => {
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
  },
);

export const fetchYearlyBudget = createAsyncThunk(
  'budget/fetchYearly',
  async () => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    return [
      { year: '2023', amount: 4000 },
      { year: '2024', amount: 4200 },
      { year: '2025', amount: 4100 },
    ];
  },
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.budgets = action.payload;
        state.loading = false;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget details';
      })
      .addCase(fetchMonthlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyBudgetSummmary = action.payload;
      })
      .addCase(fetchMonthlyBudget.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch monthly budget details';
      })
      .addCase(fetchYearlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.yearlyBudgetSummmary = action.payload;
      })
      .addCase(fetchYearlyBudget.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch yearly budget details';
      })
      .addCase(insertBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        insertBudget.fulfilled,
        (state, action: PayloadAction<Budget>) => {
          state.loading = false;
          const index = state.budgets.findIndex(
            (i) => i.id === action.payload.id,
          );
          if (index !== -1) {
            state.budgets[index] = action.payload;
          } else {
            state.budgets.push(action.payload);
          }
        },
      )
      .addCase(insertBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to insert budget details';
      });
  },
});

export default budgetSlice.reducer;

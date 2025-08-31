import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import api from '../../commons/axios';
import type { Budget, BudgetState } from './budgetTypes';

const initialState: BudgetState = {
  budgets: [],
  monthlyBudgetSummary: [],
  yearlyBudgetSummary: [],
  loading: false,
  error: null,
};

export const fetchBudget = createAsyncThunk('budget/fetch', async () => {
  const res = await api.get('/budgets');
  return res.data;
});

export const insertBudget = createAsyncThunk(
  'budget/insert',
  async (budget: Budget) => {
    const filteredBudget = Object.fromEntries(
      Object.entries(budget).filter(([_, value]) => value !== ''),
    );
    const res = await api.post('/budgets', filteredBudget);
    return res.data;
  },
);

export const fetchMonthlyYearlyIncomeSummary = createAsyncThunk(
  'budget/fetchMonthlyYearlySummary',
  async () => {
    const res = await api.get('/budgets/summary');
    return res.data;
  },
);

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (budget: Budget) => {
    const res = await api.delete(`/budgets/${budget.id}`);
    return res.data;
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
      .addCase(fetchMonthlyYearlyIncomeSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyYearlyIncomeSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyBudgetSummary = action.payload.monthSummary;
        state.yearlyBudgetSummary = action.payload.yearSummary;
      })
      .addCase(fetchMonthlyYearlyIncomeSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget summary';
      })
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete income';
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

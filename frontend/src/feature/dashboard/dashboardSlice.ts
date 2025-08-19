import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../commons/axios';
import type { Dashboard, DashboardState } from './dashboardTypes';

const initialState: DashboardState = {
  loading: false,
  error: null,
  dashboard: {
    montlyIncomeAndExpenses: [],
    budgetAndExpense: [],
    expenseCategories: [],
    topExpenses: [],
    recurringSubscriptions: [],
    fixedVariableIncomes: [],
  },
};

export const dashboard = createAsyncThunk<Dashboard, void>(
  'dashboard/fetch',
  async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.loading = false;
      })
      .addCase(dashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch dashboard details';
      });
  },
});

export default dashboardSlice.reducer;

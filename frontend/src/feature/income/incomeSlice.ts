import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import api from '../../commons/axios';
import type { Income, IncomeState } from './incomeTypes';

const initialState: IncomeState = {
  incomes: [],
  monthlyIncomeSummmary: [],
  yearlyIncomeSummmary: [],
  loading: false,
  error: null,
};

export const fetchIncome = createAsyncThunk('income/fetch', async () => {
  const res = await api.get('/incomes');
  return res.data;
});

export const insertIncome = createAsyncThunk(
  'income/insert',
  async (income: Income) => {
    const filteredIncome = Object.fromEntries(
      Object.entries(income).filter(([_, value]) => value !== ''),
    );
    const res = await api.post('/incomes', filteredIncome);
    return res.data;
  },
);

export const fetchMonthlyYearlyIncomeSummary = createAsyncThunk(
  'income/fetchMonthlyYearlySummary',
  async () => {
    const res = await api.get('/incomes/summary');
    return res.data;
  },
);

export const deleteIncome = createAsyncThunk(
  'income/deleteIncome',
  async (income: Income) => {
    const res = await api.delete(`/incomes/${income.id}`);
    return res.data;
  },
);

const salarySlice = createSlice({
  name: 'income',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncome.fulfilled, (state, action) => {
        state.incomes = action.payload;
        state.loading = false;
      })
      .addCase(fetchIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch income';
      })
      .addCase(fetchMonthlyYearlyIncomeSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyYearlyIncomeSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyIncomeSummmary = action.payload.monthSummary;
        state.yearlyIncomeSummmary = action.payload.yearSummary;
      })
      .addCase(fetchMonthlyYearlyIncomeSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch income summary';
      })
      .addCase(deleteIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncome.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete income';
      })
      .addCase(insertIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        insertIncome.fulfilled,
        (state, action: PayloadAction<Income>) => {
          state.loading = false;
          const index = state.incomes.findIndex(
            (i) => i.id === action.payload.id,
          );
          if (index !== -1) {
            state.incomes[index] = action.payload;
          } else {
            state.incomes.push(action.payload);
          }
        },
      )
      .addCase(insertIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to insert income';
      });
  },
});

export default salarySlice.reducer;

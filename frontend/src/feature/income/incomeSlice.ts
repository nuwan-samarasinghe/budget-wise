import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Income, IncomeState } from './incomeTypes';

const initialState: IncomeState = {
  incomes: [],
  monthlyIncomeSummmary: [],
  yearlyIncomeSummmary: [],
  loading: false,
  error: null,
};

export const fetchIncome = createAsyncThunk('income/fetch', async () => {
  await new Promise((res) => setTimeout(res, 500));
  return [
    {
      id: crypto.randomUUID(),
      amount: 1200,
      source: 'Salary',
      note: 'June payment',
      salaryMonth: '2024-06',
    },
    {
      id: crypto.randomUUID(),
      amount: 200,
      source: 'Freelancing',
      note: 'Logo design',
      salaryMonth: '2024-06',
    },
    {
      id: crypto.randomUUID(),
      amount: 50,
      source: 'Interest',
      note: 'Bank savings',
      salaryMonth: '2024-05',
    },
    {
      id: crypto.randomUUID(),
      amount: 100,
      source: 'Gift',
      note: 'Birthday gift',
      salaryMonth: '2024-04',
    },
    {
      id: crypto.randomUUID(),
      amount: 90,
      source: 'Interest',
      note: 'Quarterly interest',
      salaryMonth: '2024-03',
    },
    {
      id: crypto.randomUUID(),
      amount: 400,
      source: 'Bonus',
      note: 'Quarterly bonus',
      salaryMonth: '2024-03',
    },
  ];
});

export const insertIncome = createAsyncThunk(
  'income/insert',
  async (income: Income) => {
    await new Promise((res) => setTimeout(res, 500));
    //TODO waitting for backend
    if (!income.id) {
      income.id = crypto.randomUUID();
    }
    return income;
  },
);

export const fetchMonthlyIncome = createAsyncThunk(
  'income/fetchMonthly',
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

export const fetchYearlyIncome = createAsyncThunk(
  'income/fetchYearly',
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
        state.error = action.error.message || 'Failed to fetch salary';
      })
      .addCase(fetchMonthlyIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyIncomeSummmary = action.payload;
      })
      .addCase(fetchMonthlyIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch monthly income';
      })
      .addCase(fetchYearlyIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearlyIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.yearlyIncomeSummmary = action.payload;
      })
      .addCase(fetchYearlyIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch yearly income';
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

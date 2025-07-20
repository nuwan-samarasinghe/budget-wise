import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './feature/budget/budgetSlice';
import expenseReducer from './feature/expense/expenseSlice';
import incomeReducer from './feature/income/incomeSlice';

export const store = configureStore({
  reducer: {
    income: incomeReducer,
    budget: budgetReducer,
    expense: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import { ListenerMiddleware } from './commons/ListenerMiddleware';
import authReducer from './feature/auth/authSlice';
import budgetReducer from './feature/budget/budgetSlice';
import expenseReducer from './feature/expense/expenseSlice';
import incomeReducer from './feature/income/incomeSlice';
import notificationReducer from './feature/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    income: incomeReducer,
    budget: budgetReducer,
    expense: expenseReducer,
    auth: authReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(ListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

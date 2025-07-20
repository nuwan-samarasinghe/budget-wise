import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  message: string;
  type: NotificationType;
  open: boolean;
}

const initialState: NotificationState = {
  message: '',
  type: 'info',
  open: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: NotificationType }>,
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.open = true;
    },
    closeNotification: (state) => {
      state.open = false;
    },
  },
});

export const { showNotification, closeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

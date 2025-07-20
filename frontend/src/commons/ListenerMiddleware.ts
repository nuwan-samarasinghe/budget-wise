// src/app/listenerMiddleware.ts
import { createListenerMiddleware, isRejected, type MiddlewareAPI } from '@reduxjs/toolkit';
import { showNotification } from '../feature/notification/notificationSlice';

export const ListenerMiddleware = createListenerMiddleware();

ListenerMiddleware.startListening({
  matcher: isRejected,
  effect: async (action, listenerApi: MiddlewareAPI) => {
    const message =
      (action.payload as string) ||
      action.error?.message || 'Something went wrong';
    listenerApi.dispatch(
      showNotification({ message, type: 'error' })
    );
  },
});
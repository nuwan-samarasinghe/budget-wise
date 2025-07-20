import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../commons/axios';
import type { Auth, AuthState } from './authType';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (auth: Auth) => {
  const res = await api.post('/auth/login', auth);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;

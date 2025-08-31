import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../commons/axios';
import type { CategoryState } from './categoryTypes';

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('category/fetch', async () => {
  const res = await api.get('/categories');
  return res.data;
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget details';
      });
  },
});

export default categorySlice.reducer;

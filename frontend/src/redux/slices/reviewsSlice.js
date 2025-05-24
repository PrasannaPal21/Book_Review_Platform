import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ bookId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => {
    const response = await axios.get(
      `${API_URL}/reviews/book/${bookId}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    return response.data;
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async () => {
    const response = await axios.get(`${API_URL}/reviews/user`);
    return response.data;
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData);
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }) => {
    const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id) => {
    await axios.delete(`${API_URL}/reviews/${id}`);
    return id;
  }
);

export const likeReview = createAsyncThunk(
  'reviews/likeReview',
  async (id) => {
    const response = await axios.post(`${API_URL}/reviews/${id}/like`);
    return response.data;
  }
);

const initialState = {
  reviews: [],
  userReviews: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalReviews: 0
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalReviews = action.payload.totalReviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch User Reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
        state.userReviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.map(review =>
          review._id === action.payload._id ? action.payload : review
        );
        state.userReviews = state.userReviews.map(review =>
          review._id === action.payload._id ? action.payload : review
        );
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        state.userReviews = state.userReviews.filter(review => review._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Like Review
      .addCase(likeReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.map(review =>
          review._id === action.payload._id ? action.payload : review
        );
        state.userReviews = state.userReviews.map(review =>
          review._id === action.payload._id ? action.payload : review
        );
      })
      .addCase(likeReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer; 
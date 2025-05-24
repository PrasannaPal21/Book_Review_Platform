import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import reviewsReducer from './slices/reviewsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    reviews: reviewsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getUserReviews
} = require('../controllers/reviews');

// Get reviews for a book
router.get('/book/:bookId', getReviews);

// Get user's reviews
router.get('/user', protect, getUserReviews);

// Get a single review
router.get('/:id', getReview);

// Create a new review
router.post('/', protect, createReview);

// Update a review
router.put('/:id', protect, updateReview);

// Delete a review
router.delete('/:id', protect, deleteReview);

// Like/Unlike a review
router.post('/:id/like', protect, likeReview);

module.exports = router; 
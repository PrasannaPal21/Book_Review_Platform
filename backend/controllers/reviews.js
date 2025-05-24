const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments({ book: req.params.bookId });

  const reviews = await Review.find({ book: req.params.bookId })
    .populate({
      path: 'user',
      select: 'name profilePicture'
    })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination,
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'user',
    select: 'name profilePicture'
  });

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Handle both bookId and book fields
  const bookId = req.body.bookId || req.body.book;
  if (!bookId) {
    return next(new ErrorResponse('Book ID is required', 400));
  }

  // Validate required fields
  const { rating, title, content } = req.body;
  if (!rating || !title || !content) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return next(new ErrorResponse('Rating must be between 1 and 5', 400));
  }

  const bookDoc = await Book.findById(bookId);

  if (!bookDoc) {
    return next(new ErrorResponse(`No book with the id of ${bookId}`, 404));
  }

  // Check if user already reviewed this book
  const existingReview = await Review.findOne({
    user: req.user.id,
    book: bookId
  });

  if (existingReview) {
    return next(new ErrorResponse('User has already reviewed this book', 400));
  }

  try {
    const review = await Review.create({
      book: bookId,
      user: req.user.id,
      rating: parseInt(rating),
      title: title.trim(),
      content: content.trim()
    });

    // Populate the review with user and book details
    await review.populate({
      path: 'user',
      select: 'name profilePicture'
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return next(new ErrorResponse('Error creating review: ' + error.message, 500));
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user reviews
// @route   GET /api/reviews/user
// @access  Private
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({
      path: 'book',
      select: 'title coverImage'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Like/Unlike review
// @route   POST /api/reviews/:id/like
// @access  Private
exports.likeReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Check if the review has already been liked by this user
  const likeIndex = review.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike
    review.likes.splice(likeIndex, 1);
  } else {
    // Like
    review.likes.push(req.user.id);
  }

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});
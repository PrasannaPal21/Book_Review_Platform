const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

// Get all books with pagination and search
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const genre = req.query.genre;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const query = {};
  
  // Add search condition if search term exists
  if (search) {
    query.$text = { $search: search };
  }

  // Add genre filter if genre is specified
  if (genre) {
    query.genre = genre;
  }

  const books = await Book.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('addedBy', 'username');

  const total = await Book.countDocuments(query);

  res.json({
    books,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalBooks: total
  });
}));

// Get a single book by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('addedBy', 'username');
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(book);
}));

// Create a new book (admin only)
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const book = new Book({
    ...req.body,
    addedBy: req.user._id
  });

  const savedBook = await book.save();
  res.status(201).json(savedBook);
}));

// Update a book (admin only)
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  Object.assign(book, req.body);
  const updatedBook = await book.save();
  
  res.json(updatedBook);
}));

// Delete a book (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  await book.remove();
  res.json({ message: 'Book deleted successfully' });
}));

// Get books by genre
router.get('/genre/:genre', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const books = await Book.find({ genre: req.params.genre })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('addedBy', 'username');

  const total = await Book.countDocuments({ genre: req.params.genre });

  res.json({
    books,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalBooks: total
  });
}));

module.exports = router; 
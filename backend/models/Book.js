const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  coverImage: {
    type: String,
    default: ''
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Science Fiction',
      'Fantasy',
      'Romance',
      'Biography',
      'History',
      'Self-Help',
      'Other'
    ]
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please provide the published year']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for search functionality
BookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book; 
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Book.deleteMany();
  await Review.deleteMany();

  // Create users
  const password = await bcrypt.hash('password123', 10);
  const admin = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password,
    role: 'admin',
    bio: 'Admin user for the platform.'
  });
  const user = await User.create({
    username: 'johndoe',
    email: 'john@example.com',
    password,
    role: 'user',
    bio: 'Just a regular book lover.'
  });

  // Create books
  const books = await Book.insertMany([
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A novel set in the Roaring Twenties.',
      genre: 'Fiction',
      publishedYear: 1925,
      isbn: '9780743273565',
      addedBy: admin._id
    },
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      description: 'A popular-science book on cosmology.',
      genre: 'Non-Fiction',
      publishedYear: 1988,
      isbn: '9780553380163',
      addedBy: admin._id
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy novel and prelude to The Lord of the Rings.',
      genre: 'Fantasy',
      publishedYear: 1937,
      isbn: '9780547928227',
      addedBy: admin._id
    }
  ]);

  // Create reviews
  const reviews = await Review.insertMany([
    {
      book: books[0]._id,
      user: user._id,
      rating: 5,
      title: 'A timeless classic',
      content: 'Loved the writing and the story!',
      likes: []
    },
    {
      book: books[1]._id,
      user: user._id,
      rating: 4,
      title: 'Very insightful',
      content: 'Made me think about the universe differently.',
      likes: [admin._id]
    }
  ]);

  // Update book ratings
  for (const book of books) {
    await Review.calculateAverageRating(book._id);
  }

  console.log('Database seeded successfully!');
  console.log(`Users: ${await User.countDocuments()}`);
  console.log(`Books: ${await Book.countDocuments()}`);
  console.log(`Reviews: ${await Review.countDocuments()}`);

  mongoose.connection.close();
};

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
}); 
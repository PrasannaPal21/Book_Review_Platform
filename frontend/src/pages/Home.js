import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../redux/slices/booksSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ limit: 6 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to BookReview
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Discover, read, and share your thoughts about books with our community.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Books</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {book.description}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/books/${book._id}`}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/books"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View All Books
        </Link>
      </div>
    </div>
  );
};

export default Home; 
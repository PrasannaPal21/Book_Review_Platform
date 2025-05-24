import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById } from '../../redux/slices/booksSlice';
import { fetchReviews, createReview } from '../../redux/slices/reviewsSlice';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewCard from '../../components/reviews/ReviewCard';
import Spinner from '../../components/common/Spinner';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBook: book, loading: bookLoading } = useSelector((state) => state.books);
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      try {
        await dispatch(fetchBookById(id)).unwrap();
      } catch (err) {
        setError('Failed to load book details');
        console.error('Error loading book:', err);
      }
    };
    loadBook();
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchReviews({ bookId: id }));
    }
  }, [dispatch, id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const result = await dispatch(createReview({ ...reviewData, bookId: id })).unwrap();
      setShowReviewForm(false);
      // Refresh reviews after creating a new one
      dispatch(fetchReviews({ bookId: id }));
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    }
  };

  if (bookLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> Book not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={book.coverImage || '/images/book-placeholder.png'}
              alt={book.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/book-placeholder.png';
              }}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {book.genre}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{book.title}</h1>
            <p className="mt-2 text-gray-600">by {book.author}</p>
            <p className="mt-4 text-gray-600">{book.description}</p>
            <div className="mt-4">
              <span className="text-gray-600">Published: {book.publishedYear}</span>
              {book.isbn && (
                <span className="ml-4 text-gray-600">ISBN: {book.isbn}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              bookId={id}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {reviewsLoading ? (
          <Spinner />
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetail; 
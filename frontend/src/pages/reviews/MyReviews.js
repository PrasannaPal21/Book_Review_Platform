import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserReviews, deleteReview } from '../../redux/slices/reviewsSlice';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import Spinner from '../../components/common/Spinner';

const MyReviews = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews, loading } = useSelector((state) => state.reviews);
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserReviews());
    }
  }, [dispatch, user]);

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
      } catch (err) {
        setError(err.message || 'Failed to delete review');
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleSubmit = () => {
    setEditingReview(null);
    dispatch(fetchUserReviews());
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Reviews</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {editingReview ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Edit Review
          </h2>
          <ReviewForm
            review={editingReview}
            onCancel={() => setEditingReview(null)}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't written any reviews yet.</p>
          <Link
            to="/books"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews; 
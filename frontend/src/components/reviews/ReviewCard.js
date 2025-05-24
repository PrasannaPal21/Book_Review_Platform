import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeReview } from '../../redux/slices/reviewsSlice';
import { Link } from 'react-router-dom';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isAuthor = user && review.user._id === user._id;

  const handleLike = async () => {
    try {
      await dispatch(likeReview(review._id)).unwrap();
    } catch (error) {
      console.error('Failed to like review:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={review.user.profilePicture || '/default-avatar.png'}
            alt={review.user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <Link
              to={`/profile/${review.user._id}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600"
            >
              {review.user.username}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
              {review.isEdited && ' (edited)'}
            </p>
          </div>
        </div>
        {isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(review)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{review.title}</h3>
          <div className="ml-4 flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${
                  index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{review.content}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            review.likes.some(like => like._id === user?._id)
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{review.likes.length}</span>
        </button>

        {review.book && (
          <Link
            to={`/books/${review.book._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Book
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewCard; 
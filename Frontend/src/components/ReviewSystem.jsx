import React, { useState } from 'react';
import { Star, User, ThumbsUp } from 'lucide-react';

const ReviewSystem = ({ reviews = [], onAddReview, averageRating = 4.5 }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    onAddReview(newReview);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ));
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white mb-2">Customer Reviews</h3>
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-white font-bold">{averageRating}</span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300"
        >
          Write Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-white/5 rounded-2xl border border-gray-600/30">
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full p-4 bg-white/10 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              rows="4"
              placeholder="Share your experience..."
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300">
              Submit Review
            </button>
            <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-3 bg-gray-700/80 text-white font-bold rounded-2xl hover:bg-gray-600/80 transition-all duration-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="p-6 bg-white/5 rounded-2xl border border-gray-600/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{review.userName}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-gray-400 text-sm">{review.date}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
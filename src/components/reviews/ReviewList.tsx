import { useState } from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import type { Review } from '../../types';
import { useStore } from '../../store/useStore';
import StarRating from '../ui/StarRating';
import Avatar from '../ui/Avatar';
import ReviewForm from './ReviewForm';
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
  gigId: string;
}

export default function ReviewList({ reviews, gigId }: ReviewListProps) {
  const { user, isAuthenticated } = useStore();
  const [showForm, setShowForm] = useState(false);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Reviews ({reviews.length})</h2>
        {isAuthenticated && user?.role === 'client' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
              <StarRating rating={avgRating} size={18} />
              <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-gray-600">{star}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-gray-400 text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm gigId={gigId} onDone={() => setShowForm(false)} />
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <Avatar
                src={review.client?.avatar_url}
                name={review.client?.full_name || 'User'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{review.client?.full_name || 'User'}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <StarRating rating={review.rating} size={14} />
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>

                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                    <ThumbsUp size={12} />
                    Helpful
                  </button>
                </div>

                {/* Provider Response */}
                {review.provider_response && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border-l-2 border-primary-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageCircle size={12} className="text-primary-600" />
                      <span className="text-xs font-medium text-primary-600">Provider Response</span>
                    </div>
                    <p className="text-xs text-gray-600">{review.provider_response}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}

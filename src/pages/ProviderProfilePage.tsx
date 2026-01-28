import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Star, Clock, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import Avatar from '../components/ui/Avatar';
import { VerifiedBadge } from '../components/ui/Badge';
import GigCard from '../components/gigs/GigCard';
import { LOCATIONS } from '../lib/constants';
import { format } from 'date-fns';

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getProfileById, getGigsByProvider, getReviewsByGig } = useStore();

  const provider = getProfileById(id || '');
  const providerGigs = getGigsByProvider(id || '');

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Provider not found</h2>
        <Link to="/" className="text-primary-600 font-medium">Go back home</Link>
      </div>
    );
  }

  const locationName = LOCATIONS.find((l) => l.id === provider.location)?.name || provider.location;
  const allReviews = providerGigs.flatMap((g) => getReviewsByGig(g.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
        <div className="h-36 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-5 -mt-12">
            <Avatar
              src={provider.avatar_url}
              name={provider.full_name}
              size="xl"
              className="border-4 border-white shadow-md"
            />
            <div className="flex-1 pt-3">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{provider.full_name}</h1>
                {provider.is_verified && <VerifiedBadge />}
              </div>
              {provider.bio && (
                <p className="text-sm text-gray-600 mb-3 max-w-2xl">{provider.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {provider.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {locationName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined {format(new Date(provider.created_at), 'MMMM yyyy')}
                </span>
                {provider.response_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Responds {provider.response_time}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-700">
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                {provider.rating_avg}
              </div>
              <div className="text-xs text-primary-600 mt-1">Rating</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{provider.review_count}</div>
              <div className="text-xs text-gray-500 mt-1">Reviews</div>
            </div>
            <div className="bg-accent-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent-700">{provider.completion_rate}%</div>
              <div className="text-xs text-accent-600 mt-1">Completion Rate</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{providerGigs.length}</div>
              <div className="text-xs text-gray-500 mt-1">Active Gigs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gigs */}
      {providerGigs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providerGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      {allReviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reviews ({allReviews.length})
          </h2>
          <div className="space-y-4">
            {allReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={review.client?.avatar_url}
                    name={review.client?.full_name || 'User'}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.client?.full_name}</span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    {review.provider_response && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-3 border-l-2 border-primary-300">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MessageSquare size={12} className="text-primary-600" />
                          <span className="text-xs font-medium text-primary-600">Response</span>
                        </div>
                        <p className="text-xs text-gray-600">{review.provider_response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

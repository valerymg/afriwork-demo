import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Clock, Star, Shield, MessageSquare, Calendar,
  Check, ChevronRight, ArrowLeft,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import StarRating from '../components/ui/StarRating';
import Avatar from '../components/ui/Avatar';
import { VerifiedBadge } from '../components/ui/Badge';
import BookingModal from '../components/booking/BookingModal';
import ReviewList from '../components/reviews/ReviewList';
import toast from 'react-hot-toast';
import type { PricingTier } from '../types';

export default function GigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGigById, getReviewsByGig, user, isAuthenticated, startConversation } = useStore();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const gig = getGigById(id || '');
  const reviews = getReviewsByGig(id || '');

  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h2>
        <p className="text-gray-500 mb-4">This gig may have been removed or doesn't exist.</p>
        <Link to="/" className="text-primary-600 font-medium hover:text-primary-700">Go back home</Link>
      </div>
    );
  }

  const provider = gig.provider;
  const categoryName = CATEGORIES.find((c) => c.id === gig.category)?.name || gig.category;
  const locationName = LOCATIONS.find((l) => l.id === gig.location)?.name || gig.location;

  const handleContact = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to message this provider');
      navigate('/login');
      return;
    }
    const conv = startConversation(gig.provider_id, gig.id);
    navigate(`/messages/${conv.id}`);
  };

  const handleBook = (tier: PricingTier) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book this service');
      navigate('/login');
      return;
    }
    setSelectedTier(tier);
    setShowBooking(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(-1)} className="hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={16} />
          Back
        </button>
        <ChevronRight size={14} />
        <Link to={`/search?category=${gig.category}`} className="hover:text-primary-600">{categoryName}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 truncate max-w-[200px]">{gig.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Meta */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{gig.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {provider && (
                <Link
                  to={`/provider/${provider.id}`}
                  className="flex items-center gap-2 hover:text-primary-600"
                >
                  <Avatar src={provider.avatar_url} name={provider.full_name} size="sm" />
                  <span className="font-medium text-gray-700">{provider.full_name}</span>
                  {provider.is_verified && <VerifiedBadge />}
                </Link>
              )}
              <div className="flex items-center gap-1">
                <StarRating rating={gig.rating_avg} size={16} />
                <span className="font-semibold text-gray-900">{gig.rating_avg}</span>
                <span className="text-gray-400">({gig.review_count} reviews)</span>
              </div>
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin size={14} />
                {locationName}
              </span>
            </div>
          </div>

          {/* Gallery Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl block mb-2">{CATEGORIES.find((c) => c.id === gig.category)?.icon}</span>
              <p className="text-primary-600 font-medium">Service Photos</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Service</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gig.description}</p>
          </div>

          {/* Provider Stats */}
          {provider && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Provider</h2>
              <div className="flex items-start gap-4">
                <Avatar src={provider.avatar_url} name={provider.full_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/provider/${provider.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {provider.full_name}
                    </Link>
                    {provider.is_verified && <VerifiedBadge />}
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{provider.bio}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.rating_avg}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.review_count}</div>
                      <div className="text-xs text-gray-500">Reviews</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.completion_rate}%</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-gray-900">{provider.response_time}</div>
                      <div className="text-xs text-gray-500">Response</div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContact}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={16} />
                Contact {provider.full_name.split(' ')[0]}
              </button>
            </div>
          )}

          {/* Reviews */}
          <ReviewList reviews={reviews} gigId={gig.id} />
        </div>

        {/* Sidebar - Pricing */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {gig.pricing_tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-xl border-2 p-5 transition-all ${
                  tier.name === 'Standard'
                    ? 'border-primary-300 shadow-md'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {tier.name === 'Standard' && (
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  <span className="text-2xl font-bold text-gray-900">${tier.price}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{tier.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Clock size={12} />
                  <span>{tier.delivery_days}-day delivery</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={14} className="text-accent-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBook(tier)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                    tier.name === 'Standard'
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Calendar size={16} />
                  Book {tier.name}
                </button>
              </div>
            ))}

            {/* Trust badges */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-primary-600" />
                <span>Secure escrow payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-yellow-500" />
                <span>Satisfaction guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-accent-500" />
                <span>On-time delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedTier && (
        <BookingModal
          gig={gig}
          tier={selectedTier}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Clock, Star, Shield, MessageSquare, Calendar,
  Check, ChevronRight, ArrowLeft, Zap, CircleDot, Share2,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import { useTranslation } from '../lib/i18n';
import StarRating from '../components/ui/StarRating';
import Avatar from '../components/ui/Avatar';
import { VerifiedBadge } from '../components/ui/Badge';
import BookingModal from '../components/booking/BookingModal';
import ReviewList from '../components/reviews/ReviewList';
import toast from 'react-hot-toast';
import type { PricingTier } from '../types';

export default function GigDetailPage() {
  const { t, lang, formatPrice } = useTranslation();
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {lang === 'fr' ? 'Service introuvable' : 'Service not found'}
        </h2>
        <p className="text-gray-500 mb-4">
          {lang === 'fr' ? "Ce service n'existe plus ou a ete supprime." : "This gig may have been removed or doesn't exist."}
        </p>
        <Link to="/" className="text-primary-600 font-medium hover:text-primary-700">
          {lang === 'fr' ? "Retour a l'accueil" : 'Go back home'}
        </Link>
      </div>
    );
  }

  const provider = gig.provider;
  const categoryObj = CATEGORIES.find((c) => c.id === gig.category);
  const categoryName = categoryObj ? (lang === 'fr' ? categoryObj.name_fr : categoryObj.name) : gig.category;
  const locationName = LOCATIONS.find((l) => l.id === gig.location)?.name || gig.location;

  const gigTitle = lang === 'fr' ? gig.title_fr : gig.title;
  const gigDescription = lang === 'fr' ? gig.description_fr : gig.description;

  const handleContact = () => {
    if (!isAuthenticated) {
      toast.error(lang === 'fr' ? 'Connectez-vous pour contacter ce prestataire' : 'Please sign in to message this provider');
      navigate('/login');
      return;
    }
    const conv = startConversation(gig.provider_id, gig.id);
    navigate(`/messages/${conv.id}`);
  };

  const handleBook = (tier: PricingTier) => {
    if (!isAuthenticated) {
      toast.error(lang === 'fr' ? 'Connectez-vous pour reserver ce service' : 'Please sign in to book this service');
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
          {t('gig.back')}
        </button>
        <ChevronRight size={14} />
        <Link to={`/search?category=${gig.category}`} className="hover:text-primary-600">{categoryName}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 truncate max-w-[200px]">{gigTitle}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Meta */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{gigTitle}</h1>
              {gig.is_emergency && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Zap size={12} /> {t('emergency.emergencyBadge')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {provider && (
                <Link
                  to={`/provider/${provider.id}`}
                  className="flex items-center gap-2 hover:text-primary-600"
                >
                  <Avatar src={provider.avatar_url} name={provider.full_name} size="sm" />
                  <span className="font-medium text-gray-700">{provider.full_name}</span>
                  {provider.is_verified && <VerifiedBadge />}
                  {provider.is_available_now && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      <CircleDot size={10} /> {t('emergency.availableNow')}
                    </span>
                  )}
                </Link>
              )}
              <div className="flex items-center gap-1">
                <StarRating rating={gig.rating_avg} size={16} />
                <span className="font-semibold text-gray-900">{gig.rating_avg}</span>
                <span className="text-gray-400">({gig.review_count} {t('gig.reviews')})</span>
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
              <span className="text-6xl block mb-2">{categoryObj?.icon}</span>
              <p className="text-primary-600 font-medium">
                {lang === 'fr' ? 'Photos du service' : 'Service Photos'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('gig.aboutService')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gigDescription}</p>
          </div>

          {/* Provider Stats */}
          {provider && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('gig.aboutProvider')}</h2>
              <div className="flex items-start gap-4">
                <Avatar src={provider.avatar_url} name={provider.full_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/provider/${provider.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {provider.full_name}
                    </Link>
                    {provider.is_verified && <VerifiedBadge />}
                    {provider.is_available_now && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <CircleDot size={10} /> {t('emergency.availableNow')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{provider.bio}</p>

                  {/* Verification Badges */}
                  {provider.verifications && provider.verifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {provider.verifications.includes('gov_id') && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Shield size={10} /> {t('verification.govIdVerified')}
                        </span>
                      )}
                      {provider.verifications.includes('phone') && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Check size={10} /> {t('verification.phoneVerified')}
                        </span>
                      )}
                      {provider.verifications.includes('portfolio') && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Star size={10} /> {t('verification.portfolioVerified')}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.rating_avg}</div>
                      <div className="text-xs text-gray-500">{t('profile.rating')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.review_count}</div>
                      <div className="text-xs text-gray-500">{t('profile.reviewsCount')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{provider.completion_rate}%</div>
                      <div className="text-xs text-gray-500">{t('profile.completion')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-gray-900">{provider.response_time}</div>
                      <div className="text-xs text-gray-500">{t('provider.response')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContact}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={16} />
                {t('gig.contact')} {provider.full_name.split(' ')[0]}
              </button>

              {/* WhatsApp Contact */}
              {provider.phone && (
                <a
                  href={`https://wa.me/${provider.phone.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent(
                    lang === 'fr'
                      ? `Bonjour ${provider.full_name.split(' ')[0]}, je suis intéressé(e) par votre service "${gig.title_fr || gig.title}" sur AfriWork.`
                      : `Hi ${provider.full_name.split(' ')[0]}, I'm interested in your "${gig.title}" service on AfriWork.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.496A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.465-.753-6.209-2.032l-.354-.27-3.206 1.074 1.074-3.206-.27-.354A9.954 9.954 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                  WhatsApp
                </a>
              )}

              {/* Share Button */}
              <button
                onClick={() => {
                  const shareText = lang === 'fr'
                    ? `Découvrez ce service sur AfriWork: ${gig.title_fr || gig.title} - ${formatPrice(gig.pricing_tiers[0]?.price || 0)}`
                    : `Check out this service on AfriWork: ${gig.title} - ${formatPrice(gig.pricing_tiers[0]?.price || 0)}`;
                  const shareUrl = `${window.location.origin}/gig/${gig.id}`;
                  if (navigator.share) {
                    navigator.share({ title: gig.title, text: shareText, url: shareUrl });
                  } else {
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
                  }
                }}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 size={16} />
                {lang === 'fr' ? 'Partager ce service' : 'Share this service'}
              </button>
            </div>
          )}

          {/* Reviews */}
          <ReviewList reviews={reviews} gigId={gig.id} />
        </div>

        {/* Sidebar - Pricing */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {gig.pricing_tiers.map((tier) => {
              const tierDescription = lang === 'fr' ? tier.description_fr : tier.description;
              const tierFeatures = lang === 'fr' ? tier.features_fr : tier.features;

              return (
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
                      {t('gig.mostPopular')}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(tier.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{tierDescription}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock size={12} />
                    <span>{tier.delivery_days} {t('gig.dayDelivery')}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {tierFeatures.map((feature, i) => (
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
                    {t('gig.book')} {tier.name}
                  </button>
                </div>
              );
            })}

            {/* Trust badges */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-primary-600" />
                <span>{t('gig.secureEscrow')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-yellow-500" />
                <span>{t('gig.satisfaction')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-accent-500" />
                <span>{t('gig.onTime')}</span>
              </div>
              {/* Payment Methods */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">{t('booking.paymentMethod')}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded-lg">
                    <span>📱</span> MTN
                  </span>
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-lg">
                    <span>📲</span> Orange
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-lg">
                    <span>🌊</span> Wave
                  </span>
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-xs px-2 py-1 rounded-lg">
                    <span>💵</span> {lang === 'fr' ? 'Especes' : 'Cash'}
                  </span>
                </div>
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

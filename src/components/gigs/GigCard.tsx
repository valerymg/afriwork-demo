import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import type { Gig } from '../../types';
import StarRating from '../ui/StarRating';
import Avatar from '../ui/Avatar';
import { VerifiedBadge } from '../ui/Badge';
import { LOCATIONS } from '../../lib/constants';

interface GigCardProps {
  gig: Gig;
}

export default function GigCard({ gig }: GigCardProps) {
  const locationName = LOCATIONS.find((l) => l.id === gig.location)?.name || gig.location;
  const lowestPrice = Math.min(...gig.pricing_tiers.map((t) => t.price));
  const provider = gig.provider;

  return (
    <Link to={`/gigs/${gig.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
        {/* Photo placeholder */}
        <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
          <span className="text-5xl">{getCategoryEmoji(gig.category)}</span>
        </div>

        <div className="p-4">
          {/* Provider info */}
          {provider && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar src={provider.avatar_url} name={provider.full_name} size="sm" />
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {provider.full_name}
                </span>
                {provider.is_verified && <VerifiedBadge className="shrink-0" />}
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {gig.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={gig.rating_avg} size={14} />
            <span className="text-sm font-semibold text-gray-900">{gig.rating_avg}</span>
            <span className="text-xs text-gray-400">({gig.review_count})</span>
          </div>

          {/* Location & Delivery */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {locationName}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {gig.pricing_tiers[0]?.delivery_days}d delivery
            </span>
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Starting at</span>
              <span className="text-lg font-bold text-gray-900">${lowestPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    plumbing: '🔧',
    electrical: '⚡',
    carpentry: '🪚',
    painting: '🎨',
    gardening: '🌱',
    tailoring: '🧵',
    farming: '🌾',
    cleaning: '🧹',
    masonry: '🧱',
    welding: '🔥',
    roofing: '🏠',
    auto_repair: '🚗',
    hvac: '❄️',
    moving: '📦',
    pest_control: '🐛',
    tiling: '🔲',
  };
  return emojiMap[category] || '🛠️';
}

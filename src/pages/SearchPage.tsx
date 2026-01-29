import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Zap, CircleDot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS, COUNTRIES } from '../lib/constants';
import { useTranslation } from '../lib/i18n';
import GigCard from '../components/gigs/GigCard';

export default function SearchPage() {
  const { t, lang, formatPrice } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialEmergency = searchParams.get('emergency') === 'true';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'reviews' | 'newest'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(initialEmergency);
  const [availableNow, setAvailableNow] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const searchGigs = useStore((s) => s.searchGigs);

  const results = useMemo(() => {
    const found = searchGigs(query, category || undefined, location || undefined);

    let filtered = [...found];

    // Country filter
    if (country) {
      const countryLocations = LOCATIONS.filter((l) => l.country === country).map((l) => l.id);
      filtered = filtered.filter((g) => countryLocations.includes(g.location));
    }

    // Emergency filter
    if (emergencyOnly) {
      filtered = filtered.filter((g) => g.is_emergency);
    }

    // Available now filter
    if (availableNow) {
      filtered = filtered.filter((g) => g.provider?.is_available_now);
    }

    // Price range filter
    if (minPrice) {
      const min = Number(minPrice);
      filtered = filtered.filter((g) =>
        Math.min(...g.pricing_tiers.map((t) => t.price)) >= min
      );
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      filtered = filtered.filter((g) =>
        Math.min(...g.pricing_tiers.map((t) => t.price)) <= max
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_avg - a.rating_avg;
        case 'price_low':
          return Math.min(...a.pricing_tiers.map((t) => t.price)) - Math.min(...b.pricing_tiers.map((t) => t.price));
        case 'price_high':
          return Math.min(...b.pricing_tiers.map((t) => t.price)) - Math.min(...a.pricing_tiers.map((t) => t.price));
        case 'reviews':
          return b.review_count - a.review_count;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  }, [query, category, location, country, sortBy, emergencyOnly, availableNow, minPrice, maxPrice, searchGigs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (emergencyOnly) params.set('emergency', 'true');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setLocation('');
    setCountry('');
    setEmergencyOnly(false);
    setAvailableNow(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const activeFilterCount = [query, category, location, country, emergencyOnly ? 'e' : '', availableNow ? 'a' : '', minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-medium text-sm transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">{t('search.filters')}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {t('hero.search')}
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.category')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('search.allCategories')}</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {lang === 'fr' ? cat.name_fr : cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.location')}</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('search.allLocations')}</option>
                  {COUNTRIES.map((c) => (
                    <optgroup key={c.code} label={`${c.flag} ${lang === 'fr' ? c.name_fr : c.name}`}>
                      {LOCATIONS.filter((loc) => loc.country === c.code).map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rating">{t('search.highestRated')}</option>
                  <option value="reviews">{t('search.mostReviews')}</option>
                  <option value="price_low">{t('search.priceLow')}</option>
                  <option value="price_high">{t('search.priceHigh')}</option>
                  <option value="newest">{t('search.newest')}</option>
                </select>
              </div>
            </div>

            {/* Country Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'fr' ? 'Pays' : 'Country'}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{lang === 'fr' ? 'Tous les pays' : 'All Countries'}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {lang === 'fr' ? c.name_fr : c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('search.priceRange')} (FCFA)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={t('search.minPrice')}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={t('search.maxPrice')}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-2 justify-center">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <Zap size={14} className="text-red-500" />
                  <span className="text-sm text-gray-700">{t('emergency.sameDayService')}</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableNow}
                    onChange={(e) => setAvailableNow(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <CircleDot size={14} className="text-green-500" />
                  <span className="text-sm text-gray-700">{t('emergency.availableNow')}</span>
                </label>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <X size={14} />
                {t('search.clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg font-medium">
              {lang === 'fr'
                ? CATEGORIES.find((c) => c.id === category)?.name_fr
                : CATEGORIES.find((c) => c.id === category)?.name}
              <button onClick={() => setCategory('')} className="hover:text-primary-900">
                <X size={14} />
              </button>
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg font-medium">
              <MapPin size={12} />
              {LOCATIONS.find((l) => l.id === location)?.name}
              <button onClick={() => setLocation('')} className="hover:text-primary-900">
                <X size={14} />
              </button>
            </span>
          )}
          {country && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg font-medium">
              {COUNTRIES.find((c) => c.code === country)?.flag}{' '}
              {lang === 'fr'
                ? COUNTRIES.find((c) => c.code === country)?.name_fr
                : COUNTRIES.find((c) => c.code === country)?.name}
              <button onClick={() => setCountry('')} className="hover:text-primary-900">
                <X size={14} />
              </button>
            </span>
          )}
          {emergencyOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg font-medium">
              <Zap size={12} />
              {t('emergency.sameDayService')}
              <button onClick={() => setEmergencyOnly(false)} className="hover:text-red-900">
                <X size={14} />
              </button>
            </span>
          )}
          {availableNow && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg font-medium">
              <CircleDot size={12} />
              {t('emergency.availableNow')}
              <button onClick={() => setAvailableNow(false)} className="hover:text-green-900">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{results.length}</span> {t('search.servicesFound')}
          {query && (
            <>
              {' '}for "<span className="font-medium text-gray-700">{query}</span>"
            </>
          )}
        </p>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((gig) => (
            <div key={gig.id} className="relative">
              {gig.is_emergency && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Zap size={10} /> {t('emergency.emergencyBadge')}
                  </span>
                </div>
              )}
              {gig.provider?.is_available_now && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <CircleDot size={10} /> {t('emergency.availableNow')}
                  </span>
                </div>
              )}
              <GigCard gig={gig} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('search.noResults')}</h3>
          <p className="text-gray-500 mb-4">{t('search.noResultsDesc')}</p>
          <button
            onClick={clearFilters}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            {t('search.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}

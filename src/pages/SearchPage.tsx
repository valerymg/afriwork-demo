import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import GigCard from '../components/gigs/GigCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'reviews'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const searchGigs = useStore((s) => s.searchGigs);

  const results = useMemo(() => {
    const found = searchGigs(query, category || undefined, location || undefined);

    return [...found].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_avg - a.rating_avg;
        case 'price_low':
          return Math.min(...a.pricing_tiers.map((t) => t.price)) - Math.min(...b.pricing_tiers.map((t) => t.price));
        case 'price_high':
          return Math.min(...b.pricing_tiers.map((t) => t.price)) - Math.min(...a.pricing_tiers.map((t) => t.price));
        case 'reviews':
          return b.review_count - a.review_count;
        default:
          return 0;
      }
    });
  }, [query, category, location, sortBy, searchGigs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setLocation('');
    setSearchParams({});
  };

  const activeFilterCount = [query, category, location].filter(Boolean).length;

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
              placeholder="Search for services..."
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
            <span className="hidden sm:inline">Filters</span>
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
            Search
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <X size={14} />
                Clear all filters
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
              {CATEGORIES.find((c) => c.id === category)?.name}
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
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{results.length}</span> services found
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
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
          <button
            onClick={clearFilters}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

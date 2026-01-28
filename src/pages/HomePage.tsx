import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Clock, CreditCard, Star, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import GigCard from '../components/gigs/GigCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const gigs = useStore((s) => s.gigs);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    navigate(`/search?${params.toString()}`);
  };

  const topGigs = gigs
    .filter((g) => g.is_active)
    .sort((a, b) => b.rating_avg - a.rating_avg)
    .slice(0, 8);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Find Trusted Professionals for Any Job
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Connect with verified plumbers, electricians, gardeners, and skilled tradespeople in your area.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-xl max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What service do you need?"
                    className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="py-3 px-4 text-gray-700 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-primary-200">Professionals</div>
              </div>
              <div className="w-px h-10 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">16</div>
                <div className="text-primary-200">Categories</div>
              </div>
              <div className="w-px h-10 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-primary-200">Jobs Done</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <Link to="/categories" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Rated Services</h2>
          <Link to="/search" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topGigs.slice(0, 4).map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Choose ProServ</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={28} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-sm text-gray-500">Every provider is vetted and background-checked for your safety.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-accent-100 rounded-2xl flex items-center justify-center mb-4">
                <CreditCard size={28} className="text-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-500">Funds are held in escrow until you confirm the job is complete.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                <Star size={28} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Honest Reviews</h3>
              <p className="text-sm text-gray-500">Read genuine feedback from real customers before you hire.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Clock size={28} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Booking</h3>
              <p className="text-sm text-gray-500">Book a time slot that works for you and get the job done fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topGigs.slice(4, 8).map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Whether you need a pro or you are one, ProServ makes it easy to connect and get things done.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Join as Client <ArrowRight size={18} />
            </Link>
            <Link
              to="/signup"
              className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors border border-primary-400 inline-flex items-center justify-center gap-2"
            >
              Become a Provider <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

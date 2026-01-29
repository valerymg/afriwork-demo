import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Clock, CreditCard, Star, ChevronRight, Zap, CircleDot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS, COUNTRIES } from '../lib/constants';
import { useTranslation } from '../lib/i18n';
import GigCard from '../components/gigs/GigCard';

export default function HomePage() {
  const { t, lang, formatPrice } = useTranslation();
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

  const emergencyGigs = gigs
    .filter((g) => g.is_active && g.is_emergency)
    .slice(0, 4);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              {t('hero.subtitle')}
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
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="py-3 px-4 text-gray-700 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="">{t('hero.allLocations')}</option>
                  {COUNTRIES.map((country) => (
                    <optgroup key={country.code} label={`${country.flag} ${lang === 'fr' ? country.name_fr : country.name}`}>
                      {LOCATIONS.filter((loc) => loc.country === country.code).map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm whitespace-nowrap"
                >
                  {t('hero.search')}
                </button>
              </div>
            </form>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-primary-200">{t('hero.stats.professionals')}</div>
              </div>
              <div className="w-px h-10 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">16</div>
                <div className="text-primary-200">{t('hero.stats.categories')}</div>
              </div>
              <div className="w-px h-10 bg-primary-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-primary-200">{t('hero.stats.jobsDone')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('categories.title')}</h2>
          <Link to="/categories" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            {t('categories.viewAll')} <ChevronRight size={16} />
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
              <span className="text-xs font-medium text-gray-700 text-center">
                {lang === 'fr' ? cat.name_fr : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Emergency Services */}
      {emergencyGigs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap size={22} className="text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t('emergency.sameDayService')}</h2>
            </div>
            <Link to="/search?emergency=true" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              {t('home.seeAll')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {emergencyGigs.map((gig) => (
              <div key={gig.id} className="relative">
                <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Zap size={10} /> {t('emergency.emergencyBadge')}
                  </span>
                </div>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Rated Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('home.topRated')}</h2>
          <Link to="/search" className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            {t('home.seeAll')} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topGigs.slice(0, 4).map((gig) => (
            <div key={gig.id} className="relative">
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
      </section>

      {/* Trust Features */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{t('home.whyChoose')}</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={28} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.verifiedPros.title')}</h3>
              <p className="text-sm text-gray-500">{t('home.verifiedPros.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-accent-100 rounded-2xl flex items-center justify-center mb-4">
                <CreditCard size={28} className="text-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.securePayments.title')}</h3>
              <p className="text-sm text-gray-500">{t('home.securePayments.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                <Star size={28} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.honestReviews.title')}</h3>
              <p className="text-sm text-gray-500">{t('home.honestReviews.desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Clock size={28} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('home.quickBooking.title')}</h3>
              <p className="text-sm text-gray-500">{t('home.quickBooking.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('home.recentlyAdded')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topGigs.slice(4, 8).map((gig) => (
            <div key={gig.id} className="relative">
              {gig.provider?.is_available_now && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <CircleDot size={10} /> {t('emergency.availableNow')}
                  </span>
                </div>
              )}
              {gig.is_emergency && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Zap size={10} /> {t('emergency.emergencyBadge')}
                  </span>
                </div>
              )}
              <GigCard gig={gig} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('home.readyStart')}</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            {t('home.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              {t('home.joinClient')} <ArrowRight size={18} />
            </Link>
            <Link
              to="/signup"
              className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors border border-primary-400 inline-flex items-center justify-center gap-2"
            >
              {t('home.becomeProvider')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

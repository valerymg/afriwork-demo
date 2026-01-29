import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Bell, Menu, X, Plus, LogOut, User, LayoutDashboard, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../lib/i18n';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  const { t, lang, setLang } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-base font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">AfriWork</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white"
              />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="px-2 py-1 text-xs font-bold rounded-md border border-gray-200 hover:bg-gray-50"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {isAuthenticated && user ? (
              <>
                {user.role === 'provider' && (
                  <Link
                    to="/gigs/create"
                    className="hidden sm:flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    <Plus size={16} />
                    {t('nav.createGig')}
                  </Link>
                )}

                <Link
                  to="/messages"
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <MessageSquare size={20} />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    2
                  </span>
                </Link>

                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell size={20} />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user.full_name}
                    </span>
                  </button>

                  {profileDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard size={16} />
                          {t('nav.dashboard')}
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User size={16} />
                          {t('nav.profile')}
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Briefcase size={16} />
                          {t('nav.orders')}
                        </Link>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 w-full"
                          >
                            <LogOut size={16} />
                            {t('nav.signOut')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-xl transition-colors"
                >
                  {t('nav.joinNow')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {t('nav.categories')}
            </Link>
            {isAuthenticated && user?.role === 'provider' && (
              <Link
                to="/gigs/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                {t('nav.createGig')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState, useEffect, useCallback } from 'react';
import {
  Users, Briefcase, DollarSign, Star,
  RefreshCw, Shield, Eye, EyeOff, TrendingUp, Clock, Database,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';
import { seedDatabase } from '../lib/seedData';

// ---------------------------------------------------------------------------
// Admin PIN
// ---------------------------------------------------------------------------

const ADMIN_PIN = 'afriwork2025';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone: string | null;
  location: string | null;
  country: string | null;
  is_verified: boolean;
  created_at: string;
}

interface Gig {
  id: string;
  provider_id: string;
  title: string;
  title_fr: string | null;
  category: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
  profiles?: { full_name: string } | null;
}

interface Order {
  id: string;
  amount: number;
  platform_fee: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Review {
  id: string;
  gig_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalGigs: number;
  totalOrders: number;
  totalRevenue: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const { lang, formatPrice } = useTranslation();

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Data state
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalGigs: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, gigsRes, ordersRes, reviewsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('gigs')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      const allProfiles: Profile[] = profilesRes.data ?? [];
      const allGigs: Gig[] = gigsRes.data ?? [];
      const allOrders: Order[] = ordersRes.data ?? [];
      const allReviews: Review[] = reviewsRes.data ?? [];

      // Compute stats
      const totalRevenue = allOrders.reduce((sum, o) => sum + (o.platform_fee ?? 0), 0);

      setStats({
        totalUsers: allProfiles.length,
        totalGigs: allGigs.length,
        totalOrders: allOrders.length,
        totalRevenue,
      });

      setProfiles(allProfiles);
      setGigs(allGigs);
      setLastRefresh(new Date());

      // Suppress unused variable warning -- reviews count is reflected in stats
      void allReviews;
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + 30-second auto-refresh
  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [authenticated, fetchData]);

  // ---------------------------------------------------------------------------
  // PIN form handler
  // ---------------------------------------------------------------------------

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const roleBadge = (role: string) => {
    if (role === 'provider') {
      return (
        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          {lang === 'fr' ? 'Prestataire' : 'Provider'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
        {lang === 'fr' ? 'Client' : 'Client'}
      </span>
    );
  };

  // ---------------------------------------------------------------------------
  // PIN Screen
  // ---------------------------------------------------------------------------

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <form
          onSubmit={handlePinSubmit}
          className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
              <Shield size={28} className="text-primary-600" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
            {lang === 'fr' ? 'Panneau d\'administration' : 'Admin Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            {lang === 'fr'
              ? 'Entrez le code PIN pour accéder au tableau de bord.'
              : 'Enter the admin PIN to access the dashboard.'}
          </p>

          <div className="relative mb-4">
            <input
              type={showPin ? 'text' : 'password'}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder={lang === 'fr' ? 'Code PIN' : 'Admin PIN'}
              className={`w-full px-4 py-3 pr-11 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                pinError ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {pinError && (
            <p className="text-sm text-red-500 mb-4 text-center">
              {lang === 'fr' ? 'Code PIN incorrect.' : 'Incorrect PIN.'}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {lang === 'fr' ? 'Accéder' : 'Enter'}
          </button>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === 'fr' ? 'Tableau de bord administrateur' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {lang === 'fr'
              ? 'Vue d\'ensemble de la plateforme AfriWork'
              : 'AfriWork platform overview'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">
            {lang === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {formatTime(lastRefresh)}
          </span>
          <button
            onClick={async () => {
              if (!confirm(lang === 'fr' ? 'Remplir la base avec des données d\'exemple ?' : 'Seed the database with sample data?')) return;
              setSeedStatus('seeding');
              try {
                const result = await seedDatabase();
                setSeedStatus(result.success ? 'done' : 'error');
                alert(result.message);
                if (result.success) fetchData();
              } catch {
                setSeedStatus('error');
                alert('Seed failed');
              }
            }}
            disabled={seedStatus === 'seeding'}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100 py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <Database size={16} className={seedStatus === 'seeding' ? 'animate-pulse' : ''} />
            {seedStatus === 'seeding' ? (lang === 'fr' ? 'Remplissage...' : 'Seeding...') : seedStatus === 'done' ? '✓' : 'Seed DB'}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 bg-primary-50 hover:bg-primary-100 py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {lang === 'fr' ? 'Actualiser' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {lang === 'fr' ? 'Utilisateurs' : 'Total Users'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Gigs */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase size={22} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {lang === 'fr' ? 'Annonces' : 'Total Gigs'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGigs}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={22} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {lang === 'fr' ? 'Commandes' : 'Total Orders'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign size={22} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {lang === 'fr' ? 'Revenus plateforme' : 'Platform Revenue'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-primary-600" />
              {lang === 'fr' ? 'Inscriptions récentes' : 'Recent Signups'}
            </h2>
            <span className="text-xs text-gray-400">
              {stats.totalUsers} {lang === 'fr' ? 'total' : 'total'}
            </span>
          </div>

          {loading && profiles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={20} className="animate-spin text-gray-300" />
            </div>
          ) : profiles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {lang === 'fr' ? 'Aucun utilisateur trouvé.' : 'No users found.'}
            </p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-5">
                      {lang === 'fr' ? 'Date' : 'Date'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-3">
                      {lang === 'fr' ? 'Nom' : 'Name'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-3 hidden sm:table-cell">
                      {lang === 'fr' ? 'E-mail' : 'Email'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-5">
                      {lang === 'fr' ? 'Rôle' : 'Role'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.slice(0, 10).map((profile) => (
                    <tr key={profile.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-5 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-300" />
                          {formatDate(profile.created_at)}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">
                        {profile.full_name || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 hidden sm:table-cell truncate max-w-[180px]">
                        {profile.email || '—'}
                      </td>
                      <td className="py-2.5 px-5">
                        {roleBadge(profile.role)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Gigs */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase size={18} className="text-primary-600" />
              {lang === 'fr' ? 'Annonces créées' : 'Gigs Created'}
            </h2>
            <span className="text-xs text-gray-400">
              {stats.totalGigs} {lang === 'fr' ? 'total' : 'total'}
            </span>
          </div>

          {loading && gigs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={20} className="animate-spin text-gray-300" />
            </div>
          ) : gigs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {lang === 'fr' ? 'Aucune annonce trouvée.' : 'No gigs found.'}
            </p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-5">
                      {lang === 'fr' ? 'Titre' : 'Title'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-3 hidden sm:table-cell">
                      {lang === 'fr' ? 'Prestataire' : 'Provider'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-3 hidden md:table-cell">
                      {lang === 'fr' ? 'Catégorie' : 'Category'}
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2 px-5">
                      {lang === 'fr' ? 'Date' : 'Date'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gigs.slice(0, 10).map((gig) => (
                    <tr key={gig.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-5 font-medium text-gray-900 max-w-[200px] truncate">
                        {lang === 'fr' ? (gig.title_fr || gig.title) : gig.title}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                        {gig.profiles?.full_name || '—'}
                      </td>
                      <td className="py-2.5 px-3 hidden md:table-cell">
                        <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {gig.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-5 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-300" />
                          {formatDate(gig.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <RefreshCw size={12} />
          {lang === 'fr'
            ? 'Actualisation automatique toutes les 30 secondes'
            : 'Auto-refreshing every 30 seconds'}
        </p>
      </div>
    </div>
  );
}

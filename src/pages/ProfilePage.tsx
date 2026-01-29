import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Phone, Mail, Calendar, Star, Edit3, Save, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';
import Avatar from '../components/ui/Avatar';
import { VerifiedBadge } from '../components/ui/Badge';
import { LOCATIONS } from '../lib/constants';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t, lang, formatPrice } = useTranslation();
  const { user, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{lang === 'fr' ? 'Veuillez vous connecter pour voir votre profil.' : 'Please sign in to view your profile.'}</p>
        <Link to="/login" className="text-primary-600 font-medium mt-2 inline-block">{t('nav.signIn')}</Link>
      </div>
    );
  }

  const locationName = LOCATIONS.find((l) => l.id === user.location)?.name || user.location;

  const handleSave = () => {
    updateProfile(user.id, {
      full_name: name,
      bio: bio || null,
      phone: phone || null,
      location: location || null,
    });
    setEditing(false);
    toast.success(t('profile.profileUpdated'));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 -mt-10">
            <div className="relative">
              <Avatar src={user.avatar_url} name={user.full_name} size="xl" className="border-4 border-white shadow-md" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-700">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{user.full_name}</h1>
                    {user.is_verified && <VerifiedBadge />}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 py-2 px-3 rounded-lg hover:bg-primary-50"
                >
                  {editing ? <><Save size={14} /> {t('profile.saveChanges')}</> : <><Edit3 size={14} /> {t('profile.editProfile')}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-6 grid gap-6">
        {editing ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{t('profile.editProfile')}</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'fr' ? 'Nom complet' : 'Full Name'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder={lang === 'fr' ? 'Parlez de vous aux clients...' : 'Tell clients about yourself...'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.locationLabel')}</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{lang === 'fr' ? 'Choisir une ville' : 'Select location'}</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              {t('profile.saveChanges')}
            </button>
          </div>
        ) : (
          <>
            {/* Bio */}
            {user.bio && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-2">{t('profile.about')}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t('profile.details')}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-600">{locationName}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">{t('profile.memberSince')} {format(new Date(user.created_at), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Provider Stats */}
            {user.role === 'provider' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">{t('profile.performance')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-primary-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-700">
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                      {user.rating_avg}
                    </div>
                    <div className="text-xs text-primary-600 mt-1">{t('profile.rating')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.review_count}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('profile.reviewsCount')}</div>
                  </div>
                  <div className="bg-accent-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-700">{user.completion_rate}%</div>
                    <div className="text-xs text-accent-600 mt-1">{t('profile.completion')}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-lg font-bold text-gray-900">{formatPrice(user.total_earnings)}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('profile.totalEarned')}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

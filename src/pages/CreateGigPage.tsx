import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, Upload, ArrowLeft, Zap, Video } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS, COUNTRIES } from '../lib/constants';
import { useTranslation } from '../lib/i18n';
import type { PricingTier } from '../types';
import toast from 'react-hot-toast';

const emptyTier = (name: PricingTier['name']): PricingTier => ({
  name,
  price: 0,
  description: '',
  description_fr: '',
  delivery_days: 1,
  features: [''],
  features_fr: [''],
});

export default function CreateGigPage() {
  const { t, lang, formatPrice } = useTranslation();
  const navigate = useNavigate();
  const { user, createGig } = useStore();
  const [title, setTitle] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [isEmergency, setIsEmergency] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [tiers, setTiers] = useState<PricingTier[]>([
    emptyTier('Basic'),
    emptyTier('Standard'),
    emptyTier('Premium'),
  ]);

  if (!user || user.role !== 'provider') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {lang === 'fr' ? 'Acces prestataires uniquement' : 'Provider Access Only'}
        </h2>
        <p className="text-gray-500 mb-4">
          {lang === 'fr' ? 'Vous devez avoir un compte prestataire pour creer des annonces.' : 'You need a provider account to create gigs.'}
        </p>
        <Link to="/signup" className="text-primary-600 font-medium">
          {lang === 'fr' ? 'Creer un compte prestataire' : 'Create Provider Account'}
        </Link>
      </div>
    );
  }

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  const addFeature = (tierIndex: number, isFr: boolean) => {
    setTiers((prev) =>
      prev.map((t, i) => {
        if (i !== tierIndex) return t;
        return isFr
          ? { ...t, features_fr: [...t.features_fr, ''] }
          : { ...t, features: [...t.features, ''] };
      })
    );
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string, isFr: boolean) => {
    setTiers((prev) =>
      prev.map((t, i) => {
        if (i !== tierIndex) return t;
        if (isFr) {
          return { ...t, features_fr: t.features_fr.map((f, fi) => (fi === featureIndex ? value : f)) };
        }
        return { ...t, features: t.features.map((f, fi) => (fi === featureIndex ? value : f)) };
      })
    );
  };

  const removeFeature = (tierIndex: number, featureIndex: number, isFr: boolean) => {
    setTiers((prev) =>
      prev.map((t, i) => {
        if (i !== tierIndex) return t;
        if (isFr) {
          return { ...t, features_fr: t.features_fr.filter((_, fi) => fi !== featureIndex) };
        }
        return { ...t, features: t.features.filter((_, fi) => fi !== featureIndex) };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !location) {
      toast.error(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields');
      return;
    }

    const validTiers = tiers.filter((t) => t.price > 0 && t.description);
    if (validTiers.length === 0) {
      toast.error(lang === 'fr' ? 'Configurez au moins une formule de prix' : 'Please configure at least one pricing tier');
      return;
    }

    const cleanedTiers = validTiers.map((t) => ({
      ...t,
      features: t.features.filter((f) => f.trim()),
      features_fr: t.features_fr.filter((f) => f.trim()),
    }));

    const gig = createGig({
      provider_id: user.id,
      title: title.trim(),
      title_fr: titleFr.trim() || title.trim(),
      description: description.trim(),
      description_fr: descriptionFr.trim() || description.trim(),
      category,
      subcategory: null,
      location,
      pricing_tiers: cleanedTiers,
      photos: [],
      video_urls: videoUrl.trim() ? [videoUrl.trim()] : [],
      is_emergency: isEmergency,
    });

    toast.success(lang === 'fr' ? 'Annonce creee avec succes !' : 'Gig created successfully!');
    navigate(`/gigs/${gig.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} />
        {t('gig.back')}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {lang === 'fr' ? 'Creer une nouvelle annonce' : 'Create a New Gig'}
      </h1>
      <p className="text-gray-500 mb-8">
        {lang === 'fr' ? 'Publiez votre service pour que les clients puissent vous trouver et vous reserver.' : 'List your service so clients can find and book you.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">
            {lang === 'fr' ? 'Details du service' : 'Service Details'}
          </h2>

          {/* Title EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'fr' ? 'Titre (Anglais)' : 'Title (English)'} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'fr' ? 'ex: Reparation et installation de plomberie professionnelle' : 'e.g., Professional Plumbing Repair & Installation'}
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
          </div>

          {/* Title FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'fr' ? 'Titre (Francais)' : 'Title (French)'} *
            </label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              placeholder={lang === 'fr' ? 'ex: Reparation et installation de plomberie professionnelle' : 'e.g., Reparation et installation de plomberie'}
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 mt-1">{titleFr.length}/100</p>
          </div>

          {/* Description EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'fr' ? 'Description (Anglais)' : 'Description (English)'} *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'fr' ? 'Decrivez votre service en detail (en anglais).' : "Describe your service in detail. What do you offer? What's your experience?"}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Description FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === 'fr' ? 'Description (Francais)' : 'Description (French)'} *
            </label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              placeholder={lang === 'fr' ? 'Decrivez votre service en detail (en francais).' : 'Describe your service in detail (in French).'}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search.category')} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search.location')} *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          </div>

          {/* Emergency Toggle */}
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <label className="inline-flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Zap size={16} className="text-red-500" />
              <div>
                <span className="text-sm font-medium text-gray-900">{t('dashboard.emergencyService')}</span>
                <p className="text-xs text-gray-500">
                  {lang === 'fr' ? 'Ce service est disponible pour des interventions le jour meme' : 'This service is available for same-day urgent requests'}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {lang === 'fr' ? 'Photos' : 'Photos'}
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {lang === 'fr' ? 'Glissez-deposez vos photos ici, ou cliquez pour parcourir' : 'Drag and drop photos here, or click to browse'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'fr' ? 'PNG, JPG jusqu\'a 5 Mo chacun (max 6 photos)' : 'PNG, JPG up to 5MB each (max 6 photos)'}
            </p>
          </div>
        </div>

        {/* Video Portfolio Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Video size={18} className="text-primary-600" />
            {lang === 'fr' ? 'Video portfolio' : 'Video Portfolio'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {lang === 'fr'
              ? 'Ajoutez une video pour presenter votre travail et gagner la confiance des clients.'
              : 'Add a video to showcase your work and build client trust.'}
          </p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer mb-3">
            <Video size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {lang === 'fr' ? 'Glissez-deposez votre video ici' : 'Drag and drop video here'}
            </p>
            <p className="text-xs text-gray-400 mt-1">MP4, MOV - max 50MB</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {lang === 'fr' ? 'Ou collez un lien video (YouTube, etc.)' : 'Or paste a video link (YouTube, etc.)'}
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {lang === 'fr' ? 'Formules de prix' : 'Pricing Tiers'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {lang === 'fr'
              ? 'Configurez vos formules. Configurez au moins une formule.'
              : 'Set up your packages. Configure at least one tier.'}
          </p>

          <div className="space-y-6">
            {tiers.map((tier, tierIdx) => (
              <div key={tier.name} className={`rounded-xl border p-5 ${tierIdx === 1 ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  {tierIdx === 1 && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                      {lang === 'fr' ? 'Recommande' : 'Recommended'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {lang === 'fr' ? 'Prix (FCFA)' : 'Price (FCFA)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tier.price || ''}
                      onChange={(e) => updateTier(tierIdx, { price: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {tier.price > 0 && (
                      <p className="text-xs text-gray-400 mt-1">{formatPrice(tier.price)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {lang === 'fr' ? 'Delai (jours)' : 'Delivery (days)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tier.delivery_days}
                      onChange={(e) => updateTier(tierIdx, { delivery_days: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Description EN */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {lang === 'fr' ? 'Description (Anglais)' : 'Description (English)'}
                  </label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => updateTier(tierIdx, { description: e.target.value })}
                    placeholder={lang === 'fr' ? 'Breve description de cette formule (anglais)' : 'Brief description of this package'}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Description FR */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {lang === 'fr' ? 'Description (Francais)' : 'Description (French)'}
                  </label>
                  <input
                    type="text"
                    value={tier.description_fr}
                    onChange={(e) => updateTier(tierIdx, { description_fr: e.target.value })}
                    placeholder={lang === 'fr' ? 'Breve description de cette formule (francais)' : 'Brief description of this package (French)'}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Features EN */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {lang === 'fr' ? 'Caracteristiques (Anglais)' : 'Features (English)'}
                  </label>
                  <div className="space-y-2">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(tierIdx, featureIdx, e.target.value, false)}
                          placeholder={lang === 'fr' ? 'ex: Garantie 30 jours' : 'e.g., 30-day warranty'}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {tier.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(tierIdx, featureIdx, false)}
                            className="p-1.5 text-gray-400 hover:text-danger-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(tierIdx, false)}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus size={12} />
                      {lang === 'fr' ? 'Ajouter une caracteristique' : 'Add feature'}
                    </button>
                  </div>
                </div>

                {/* Features FR */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {lang === 'fr' ? 'Caracteristiques (Francais)' : 'Features (French)'}
                  </label>
                  <div className="space-y-2">
                    {tier.features_fr.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(tierIdx, featureIdx, e.target.value, true)}
                          placeholder={lang === 'fr' ? 'ex: Garantie 30 jours' : 'e.g., Garantie 30 jours'}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {tier.features_fr.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(tierIdx, featureIdx, true)}
                            className="p-1.5 text-gray-400 hover:text-danger-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(tierIdx, true)}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus size={12} />
                      {lang === 'fr' ? 'Ajouter une caracteristique' : 'Add feature'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="py-3 px-6 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('profile.cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {lang === 'fr' ? 'Publier l\'annonce' : 'Publish Gig'}
          </button>
        </div>
      </form>
    </div>
  );
}

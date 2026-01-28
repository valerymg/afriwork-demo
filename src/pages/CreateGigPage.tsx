import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import type { PricingTier } from '../types';
import toast from 'react-hot-toast';

const emptyTier = (name: PricingTier['name']): PricingTier => ({
  name,
  price: 0,
  description: '',
  delivery_days: 1,
  features: [''],
});

export default function CreateGigPage() {
  const navigate = useNavigate();
  const { user, createGig } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [tiers, setTiers] = useState<PricingTier[]>([
    emptyTier('Basic'),
    emptyTier('Standard'),
    emptyTier('Premium'),
  ]);

  if (!user || user.role !== 'provider') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Provider Access Only</h2>
        <p className="text-gray-500 mb-4">You need a provider account to create gigs.</p>
        <Link to="/signup" className="text-primary-600 font-medium">Create Provider Account</Link>
      </div>
    );
  }

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  const addFeature = (tierIndex: number) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === tierIndex ? { ...t, features: [...t.features, ''] } : t))
    );
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, features: t.features.map((f, fi) => (fi === featureIndex ? value : f)) }
          : t
      )
    );
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, features: t.features.filter((_, fi) => fi !== featureIndex) }
          : t
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validTiers = tiers.filter((t) => t.price > 0 && t.description);
    if (validTiers.length === 0) {
      toast.error('Please configure at least one pricing tier');
      return;
    }

    const cleanedTiers = validTiers.map((t) => ({
      ...t,
      features: t.features.filter((f) => f.trim()),
    }));

    const gig = createGig({
      provider_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: null,
      location,
      pricing_tiers: cleanedTiers,
      photos: [],
    });

    toast.success('Gig created successfully!');
    navigate(`/gigs/${gig.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a New Gig</h1>
      <p className="text-gray-500 mb-8">List your service so clients can find and book you.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Service Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Professional Plumbing Repair & Installation"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service in detail. What do you offer? What's your experience?"
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Photos</h2>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Drag and drop photos here, or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each (max 6 photos)</p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing Tiers</h2>
          <p className="text-sm text-gray-500 mb-6">Set up your packages. Configure at least one tier.</p>

          <div className="space-y-6">
            {tiers.map((tier, tierIdx) => (
              <div key={tier.name} className={`rounded-xl border p-5 ${tierIdx === 1 ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  {tierIdx === 1 && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={tier.price || ''}
                      onChange={(e) => updateTier(tierIdx, { price: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Delivery (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={tier.delivery_days}
                      onChange={(e) => updateTier(tierIdx, { delivery_days: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => updateTier(tierIdx, { description: e.target.value })}
                    placeholder="Brief description of this package"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Features</label>
                  <div className="space-y-2">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(tierIdx, featureIdx, e.target.value)}
                          placeholder="e.g., 30-day warranty"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {tier.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(tierIdx, featureIdx)}
                            className="p-1.5 text-gray-400 hover:text-danger-500"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(tierIdx)}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus size={12} />
                      Add feature
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
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Publish Gig
          </button>
        </div>
      </form>
    </div>
  );
}

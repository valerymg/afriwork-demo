import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/constants';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';

export default function CategoriesPage() {
  const { t, lang } = useTranslation();
  const gigs = useStore((s) => s.gigs);

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: gigs.filter((g) => g.category === cat.id && g.is_active).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('categories.title')}</h1>
      <p className="text-gray-500 mb-8">{lang === 'fr' ? 'Parcourez les professionnels qualifi\u00E9s par type de service' : 'Browse skilled professionals by service type'}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryCounts.map((cat) => (
          <Link
            key={cat.id}
            to={`/search?category=${cat.id}`}
            className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cat.color}`}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {lang === 'fr' ? cat.name_fr : cat.name}
              </h3>
              <p className="text-xs text-gray-400 truncate">{lang === 'fr' ? cat.description_fr : cat.description}</p>
              <p className="text-xs text-gray-500 mt-1">{cat.count} {cat.count !== 1 ? t('categories.services') : t('categories.service')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

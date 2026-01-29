import { Link } from 'react-router-dom';
import { useTranslation } from '../../lib/i18n';

export default function Footer() {
  const { t, lang } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-base font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AfriWork</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="mt-4 flex gap-3">
              <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded-lg">📱 MTN MoMo</span>
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-lg">📲 Orange</span>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-lg">🌊 Wave</span>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.forClients')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.browseServicesLink')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Explorez 50+ catégories de services' : 'Explore 50+ service categories'}
                </p>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.findProfessionals')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Recherchez par ville, prix et avis' : 'Search by city, price, and reviews'}
                </p>
              </li>
              <li>
                <Link to="/search?emergency=true" className="text-sm text-gray-500 hover:text-primary-600">
                  {lang === 'fr' ? 'Services d\'urgence' : 'Emergency Services'}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Trouvez un pro disponible maintenant' : 'Find a pro available right now'}
                </p>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.forProviders')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/signup" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.becomeProviderLink')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Inscrivez-vous gratuitement et recevez des clients' : 'Sign up free and start getting clients'}
                </p>
              </li>
              <li>
                <Link to="/gigs/create" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.createGigLink')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Publiez vos services et fixez vos tarifs' : 'List your services and set your rates'}
                </p>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.successTips')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Optimisez votre profil et augmentez vos revenus' : 'Optimize your profile and boost earnings'}
                </p>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.support')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.helpCenter')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'FAQ, guides et assistance' : 'FAQ, guides, and assistance'}
                </p>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.trustSafety')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Paiement séquestre et vérification d\'identité' : 'Escrow payments and ID verification'}
                </p>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-primary-600">
                  {t('footer.contactUs')}
                </Link>
                <p className="text-xs text-gray-400">
                  {lang === 'fr' ? 'Assistance par email et téléphone' : 'Email and phone support'}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works section */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center">{t('footer.howItWorks')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <span className="text-2xl block mb-1">🔍</span>
              <p className="text-xs font-medium text-gray-700">
                {lang === 'fr' ? '1. Recherchez un service' : '1. Search a service'}
              </p>
            </div>
            <div className="p-3">
              <span className="text-2xl block mb-1">📋</span>
              <p className="text-xs font-medium text-gray-700">
                {lang === 'fr' ? '2. Comparez et réservez' : '2. Compare & book'}
              </p>
            </div>
            <div className="p-3">
              <span className="text-2xl block mb-1">💰</span>
              <p className="text-xs font-medium text-gray-700">
                {lang === 'fr' ? '3. Payez en sécurité' : '3. Pay securely'}
              </p>
            </div>
            <div className="p-3">
              <span className="text-2xl block mb-1">⭐</span>
              <p className="text-xs font-medium text-gray-700">
                {lang === 'fr' ? '4. Notez le prestataire' : '4. Rate the provider'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">🇨🇲 Cameroun</span>
            <span className="text-xs text-gray-400">🇨🇮 Côte d'Ivoire</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">{t('footer.privacy')}</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

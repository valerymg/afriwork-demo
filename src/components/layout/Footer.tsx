import { Link } from 'react-router-dom';
import { useTranslation } from '../../lib/i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.forClients')}</h3>
            <ul className="space-y-2">
              <li><Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.browseServicesLink')}</Link></li>
              <li><Link to="/search" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.findProfessionals')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.howItWorks')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.forProviders')}</h3>
            <ul className="space-y-2">
              <li><Link to="/signup" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.becomeProviderLink')}</Link></li>
              <li><Link to="/gigs/create" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.createGigLink')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.successTips')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.helpCenter')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.trustSafety')}</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">{t('footer.contactUs')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">{t('footer.privacy')}</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">{t('footer.terms')}</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

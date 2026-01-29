import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, Briefcase, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../lib/i18n';

export default function MobileNav() {
  const location = useLocation();
  const { isAuthenticated } = useStore();
  const { t } = useTranslation();
  const path = location.pathname;

  // Hide mobile nav on auth pages
  if (path === '/login' || path === '/signup') return null;

  const navItems = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/search', icon: Search, label: t('search.searchServices') },
    ...(isAuthenticated
      ? [
          { to: '/messages', icon: MessageSquare, label: t('nav.messages') },
          { to: '/orders', icon: Briefcase, label: t('nav.orders') },
          { to: '/profile', icon: User, label: t('nav.profile') },
        ]
      : [
          { to: '/login', icon: User, label: t('nav.signIn') },
        ]),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = path === item.to || (item.to !== '/' && path.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Wrench, Home } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../lib/i18n';
import toast from 'react-hot-toast';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const signup = useStore((s) => s.signup);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error(t('auth.fillAll'));
      return;
    }
    if (password.length < 6) {
      toast.error(t('auth.minChars'));
      return;
    }
    const success = signup(name, email, password, role);
    if (success) {
      toast.success(t('auth.accountCreated'));
      navigate('/');
    } else {
      toast.error('Signup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary-700">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            AfriWork
          </Link>
          <p className="mt-2 text-gray-500">{t('auth.createAccount')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('auth.role')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  role === 'client'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Home
                  size={24}
                  className={`mx-auto mb-2 ${role === 'client' ? 'text-primary-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm font-medium ${role === 'client' ? 'text-primary-700' : 'text-gray-600'}`}
                >
                  {t('auth.hireServices')}
                </span>
                <p className="text-xs text-gray-400 mt-1">{t('auth.hireDesc')}</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  role === 'provider'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wrench
                  size={24}
                  className={`mx-auto mb-2 ${role === 'provider' ? 'text-primary-600' : 'text-gray-400'}`}
                />
                <span
                  className={`text-sm font-medium ${role === 'provider' ? 'text-primary-700' : 'text-gray-600'}`}
                >
                  {t('auth.offerServices')}
                </span>
                <p className="text-xs text-gray-400 mt-1">{t('auth.offerDesc')}</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.fullName')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amadou Diallo"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.minChars')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              {t('auth.createAccount')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

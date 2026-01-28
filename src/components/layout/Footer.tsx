import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-base font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ProServ</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Connecting skilled professionals with clients who need quality manual labor services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">For Clients</h3>
            <ul className="space-y-2">
              <li><Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600">Browse Services</Link></li>
              <li><Link to="/search" className="text-sm text-gray-500 hover:text-primary-600">Find Professionals</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">For Providers</h3>
            <ul className="space-y-2">
              <li><Link to="/signup" className="text-sm text-gray-500 hover:text-primary-600">Become a Provider</Link></li>
              <li><Link to="/gigs/create" className="text-sm text-gray-500 hover:text-primary-600">Create a Gig</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">Success Tips</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">Help Center</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">Trust & Safety</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">&copy; 2025 ProServ. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">Privacy</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">Terms</Link>
            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

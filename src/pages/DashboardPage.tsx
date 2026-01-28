import { Link } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Briefcase, Star,
  Clock, ArrowRight, Plus, MessageSquare,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import GigCard from '../components/gigs/GigCard';

export default function DashboardPage() {
  const { user, getOrdersByUser, getGigsByProvider, getBookingsByUser } = useStore();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Please sign in to view your dashboard.</p>
        <Link to="/login" className="text-primary-600 font-medium mt-2 inline-block">Sign In</Link>
      </div>
    );
  }

  const isProvider = user.role === 'provider';
  const orders = getOrdersByUser(user.id);
  const bookings = getBookingsByUser(user.id);
  const myGigs = isProvider ? getGigsByProvider(user.id) : [];

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const activeOrders = orders.filter((o) => o.status === 'in_progress' || o.status === 'paid');
  const pendingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.full_name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500">Here's what's happening with your account.</p>
        </div>
        {isProvider && (
          <Link
            to="/gigs/create"
            className="hidden sm:flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <Plus size={16} />
            New Gig
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isProvider ? (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={20} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="text-xl font-bold text-gray-900">${user.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-warning-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-gray-900">${user.pending_earnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Earned</p>
                  <p className="text-xl font-bold text-gray-900">${user.total_earnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-xl font-bold text-gray-900">{user.rating_avg} / 5</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Orders</p>
                  <p className="text-xl font-bold text-gray-900">{activeOrders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-xl font-bold text-gray-900">{completedOrders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-warning-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Upcoming</p>
                  <p className="text-xl font-bold text-gray-900">{pendingBookings.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageSquare size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Messages</p>
                  <Link to="/messages" className="text-xl font-bold text-primary-600 hover:text-primary-700">View</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/orders" className="text-sm text-primary-600 font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {orders.slice(0, 3).length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(-4)}</p>
                    <p className="text-xs text-gray-500">${order.amount}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    order.status === 'completed'
                      ? 'bg-accent-100 text-accent-700'
                      : order.status === 'in_progress'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">No recent activity.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              {isProvider ? 'Upcoming Bookings' : 'Scheduled Services'}
            </h2>
          </div>
          {pendingBookings.length > 0 ? (
            <div className="space-y-3">
              {pendingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.gig?.title?.slice(0, 30)}...</p>
                    <p className="text-xs text-gray-500">{booking.scheduled_date} at {booking.scheduled_time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-warning-100 text-warning-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">No upcoming bookings.</p>
          )}
        </div>
      </div>

      {/* Provider Gigs */}
      {isProvider && myGigs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Your Gigs</h2>
            <Link to="/gigs/create" className="text-sm text-primary-600 font-medium flex items-center gap-1">
              <Plus size={14} /> New Gig
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

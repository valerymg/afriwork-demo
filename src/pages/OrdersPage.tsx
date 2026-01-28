import { Link } from 'react-router-dom';
import { Clock, Check, AlertCircle, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user, orders, getOrdersByUser, updateOrderStatus, updateBookingStatus, bookings } = useStore();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Please sign in to view your orders.</p>
        <Link to="/login" className="text-primary-600 font-medium mt-2 inline-block">Sign In</Link>
      </div>
    );
  }

  const userOrders = getOrdersByUser(user.id);
  const isProvider = user.role === 'provider';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'paid':
        return <Badge variant="primary">Paid</Badge>;
      case 'in_progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="accent">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="neutral">Refunded</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'held':
        return <Badge variant="warning">Held in Escrow</Badge>;
      case 'released':
        return <Badge variant="accent">Released</Badge>;
      case 'refunded':
        return <Badge variant="danger">Refunded</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', 'released');
    const order = orders.find((o) => o.id === orderId);
    if (order?.booking_id) {
      updateBookingStatus(order.booking_id, 'completed');
    }
    toast.success('Order marked as complete. Payment released to provider!');
  };

  const getBookingForOrder = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {isProvider ? 'My Jobs' : 'My Orders'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isProvider ? 'Manage your active and completed jobs.' : 'Track your service bookings and payments.'}
      </p>

      {userOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">
            {isProvider ? 'Orders will appear here when clients book your services.' : 'Browse services and make your first booking!'}
          </p>
          <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
            Browse Services <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const booking = getBookingForOrder(order.booking_id);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {booking?.gig?.title || `Order ${order.id}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {booking?.scheduled_date && format(new Date(booking.scheduled_date), 'MMM d, yyyy')}
                        {booking?.scheduled_time && ` at ${booking.scheduled_time}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">Total</span>
                      <div className="font-semibold text-gray-900">${order.amount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Platform Fee</span>
                      <div className="text-gray-600">${order.platform_fee.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">{isProvider ? 'Your Earnings' : 'Provider Gets'}</span>
                      <div className="text-accent-600 font-medium">${order.provider_earnings.toFixed(2)}</div>
                    </div>
                  </div>

                  {!isProvider && order.status === 'in_progress' && (
                    <button
                      onClick={() => handleComplete(order.id)}
                      className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                    >
                      <Check size={16} />
                      Mark Complete
                    </button>
                  )}
                  {!isProvider && order.status === 'paid' && (
                    <span className="flex items-center gap-1.5 text-sm text-warning-600">
                      <AlertCircle size={16} />
                      Awaiting provider
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Check, AlertCircle, DollarSign, Calendar, ArrowRight, Shield, Flag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../lib/i18n';
import { PAYMENT_METHODS } from '../lib/constants';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { t, lang, formatPrice } = useTranslation();
  const { user, orders, getOrdersByUser, updateOrderStatus, updateBookingStatus, bookings } = useStore();
  const [showDisputeModal, setShowDisputeModal] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">
          {lang === 'fr' ? 'Connectez-vous pour voir vos commandes.' : 'Please sign in to view your orders.'}
        </p>
        <Link to="/login" className="text-primary-600 font-medium mt-2 inline-block">{t('nav.signIn')}</Link>
      </div>
    );
  }

  const userOrders = getOrdersByUser(user.id);
  const isProvider = user.role === 'provider';

  const getStatusBadge = (status: string) => {
    const key = `orders.orderStatus.${status}` as const;
    const label = t(key);
    switch (status) {
      case 'pending':
        return <Badge variant="warning">{label}</Badge>;
      case 'paid':
        return <Badge variant="primary">{label}</Badge>;
      case 'in_progress':
        return <Badge variant="primary">{label}</Badge>;
      case 'completed':
        return <Badge variant="accent">{label}</Badge>;
      case 'cancelled':
        return <Badge variant="danger">{label}</Badge>;
      case 'refunded':
        return <Badge variant="neutral">{label}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    const key = `orders.paymentStatus.${status}` as const;
    const label = t(key);
    switch (status) {
      case 'held':
        return <Badge variant="warning">{label}</Badge>;
      case 'released':
        return <Badge variant="accent">{label}</Badge>;
      case 'refunded':
        return <Badge variant="danger">{label}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (methodId: string) => {
    const method = PAYMENT_METHODS.find((m) => m.id === methodId);
    if (!method) return methodId;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${method.color}`}>
        {method.icon} {lang === 'fr' ? method.name_fr : method.name}
      </span>
    );
  };

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', 'released');
    const order = orders.find((o) => o.id === orderId);
    if (order?.booking_id) {
      updateBookingStatus(order.booking_id, 'completed');
    }
    toast.success(t('orders.paymentReleased'));
  };

  const handleDispute = (orderId: string) => {
    if (!disputeReason.trim()) {
      toast.error(lang === 'fr' ? 'Veuillez decrire le probleme' : 'Please describe the issue');
      return;
    }
    // In a real app, this would create a dispute record
    toast.success(t('dispute.disputeSubmitted'));
    setShowDisputeModal(null);
    setDisputeReason('');
  };

  const getBookingForOrder = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {isProvider ? t('orders.myJobs') : t('orders.myOrders')}
      </h1>
      <p className="text-gray-500 mb-8">
        {isProvider ? t('orders.manageJobs') : t('orders.trackOrders')}
      </p>

      {userOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('orders.noOrders')}</h3>
          <p className="text-gray-500 mb-4">
            {isProvider ? t('orders.noOrdersProvider') : t('orders.noOrdersClient')}
          </p>
          <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
            {t('orders.browseServices')} <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const booking = getBookingForOrder(order.booking_id);
            const gigTitle = booking?.gig
              ? (lang === 'fr' ? booking.gig.title_fr : booking.gig.title)
              : `Order ${order.id}`;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{gigTitle}</h3>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                  </div>
                </div>

                {/* Escrow indicator */}
                {order.payment_status === 'held' && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Shield size={14} className="text-yellow-600" />
                    <span className="text-xs text-yellow-800">
                      {t('payment.escrowProtection')} - {t('payment.fundsHeld')}
                    </span>
                  </div>
                )}

                {/* Payment method */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-400">{t('booking.paymentMethod')}:</span>
                  {getPaymentMethodDisplay(order.payment_method)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">{t('orders.totalLabel')}</span>
                      <div className="font-semibold text-gray-900">{formatPrice(order.amount)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">{t('orders.platformFee')}</span>
                      <div className="text-gray-600">{formatPrice(order.platform_fee)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">
                        {isProvider ? t('orders.yourEarnings') : t('orders.providerGets')}
                      </span>
                      <div className="text-accent-600 font-medium">{formatPrice(order.provider_earnings)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isProvider && order.status === 'in_progress' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                      >
                        <Check size={16} />
                        {t('orders.markComplete')}
                      </button>
                    )}
                    {!isProvider && order.status === 'paid' && (
                      <span className="flex items-center gap-1.5 text-sm text-warning-600">
                        <AlertCircle size={16} />
                        {t('orders.awaitingProvider')}
                      </span>
                    )}

                    {/* Dispute button */}
                    {(order.status === 'in_progress' || order.status === 'paid') && (
                      <button
                        onClick={() => setShowDisputeModal(order.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 py-2 px-3 rounded-xl border border-gray-200 hover:border-red-200 transition-colors"
                      >
                        <Flag size={14} />
                        {t('orders.reportIssue')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dispute.reportDispute')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('dispute.disputeDesc')}</p>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
              placeholder={t('dispute.disputeTitle')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDisputeModal(null); setDisputeReason(''); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('profile.cancel')}
              </button>
              <button
                onClick={() => handleDispute(showDisputeModal)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium"
              >
                {t('dispute.submitDispute')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

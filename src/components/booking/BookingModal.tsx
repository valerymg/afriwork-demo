import { useState, useMemo } from 'react';
import { X, Calendar, Clock, CreditCard, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from 'date-fns';
import type { Gig, PricingTier } from '../../types';
import { useStore } from '../../store/useStore';
import { PLATFORM_FEE_RATE } from '../../lib/constants';
import { TIME_SLOTS } from '../../lib/constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  gig: Gig;
  tier: PricingTier;
  onClose: () => void;
}

export default function BookingModal({ gig, tier, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'date' | 'confirm'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const { user, createBooking, createOrder } = useStore();

  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const platformFee = Math.round(tier.price * PLATFORM_FEE_RATE * 100) / 100;
  const total = tier.price + platformFee;

  const blanks = useMemo(() => Array.from({ length: startDayOfWeek }, (_, i) => i), [startDayOfWeek]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !user) return;

    const booking = createBooking({
      gig_id: gig.id,
      client_id: user.id,
      provider_id: gig.provider_id,
      tier: tier.name,
      price: tier.price,
      scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
      scheduled_time: selectedTime,
      status: 'pending',
      notes: notes || null,
      gig,
    });

    createOrder({
      booking_id: booking.id,
      client_id: user.id,
      provider_id: gig.provider_id,
      amount: total,
      platform_fee: platformFee,
      provider_earnings: tier.price - platformFee,
      payment_intent_id: `pi_mock_${Date.now()}`,
      payment_status: 'held',
      status: 'paid',
      booking,
    });

    toast.success('Booking confirmed! Payment held in escrow.');
    onClose();
    navigate('/orders');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Book Service</h2>
            <p className="text-sm text-gray-500">{tier.name} - ${tier.price}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {step === 'date' ? (
            <div className="space-y-6">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={18} className="text-primary-600" />
                    Select Date
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentMonth(addDays(monthStart, -1))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium px-2">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button
                      onClick={() => setCurrentMonth(addDays(monthEnd, 1))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-400 py-2">{day}</div>
                  ))}
                  {blanks.map((i) => (
                    <div key={`blank-${i}`} />
                  ))}
                  {daysInMonth.map((day) => {
                    const isPast = isBefore(day, minDate);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    return (
                      <button
                        key={day.toISOString()}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={`py-2 text-sm rounded-lg transition-all ${
                          isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : isSelected
                              ? 'bg-primary-600 text-white font-semibold'
                              : 'text-gray-700 hover:bg-primary-50'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                    <Clock size={18} className="text-primary-600" />
                    Select Time
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-2 text-xs rounded-lg font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-primary-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes for the provider (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what you need help with..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('confirm')}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="text-gray-900 font-medium text-right max-w-[200px] truncate">{gig.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package</span>
                    <span className="text-gray-900">{tier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900">{selectedDate && format(selectedDate, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-gray-900">{tier.delivery_days} day{tier.delivery_days > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Price</span>
                  <span className="text-gray-900">${tier.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="text-gray-900">${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Escrow Notice */}
              <div className="bg-primary-50 rounded-xl p-4 flex items-start gap-3">
                <Shield size={20} className="text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-900">Secure Escrow Payment</p>
                  <p className="text-xs text-primary-700 mt-0.5">
                    Your payment will be held securely until you confirm the job is complete. 100% money-back guarantee if unsatisfied.
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                <CreditCard size={18} className="text-gray-400" />
                <span>Payment via Stripe (secured)</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('date')}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

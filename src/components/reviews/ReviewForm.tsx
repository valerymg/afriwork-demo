import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../lib/i18n';
import StarRating from '../ui/StarRating';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  gigId: string;
  onDone: () => void;
}

export default function ReviewForm({ gigId, onDone }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user, addReview, gigs } = useStore();
  const { t, lang } = useTranslation();

  const gig = gigs.find((g) => g.id === gigId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !gig) return;
    if (rating === 0) {
      toast.error(lang === 'fr' ? 'Veuillez choisir une note' : 'Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error(lang === 'fr' ? 'L\'avis doit contenir au moins 10 caracteres' : 'Review must be at least 10 characters');
      return;
    }

    addReview({
      gig_id: gigId,
      order_id: `order-${Date.now()}`,
      client_id: user.id,
      provider_id: gig.provider_id,
      rating,
      comment: comment.trim(),
      provider_response: null,
    });

    toast.success(lang === 'fr' ? 'Avis soumis !' : 'Review submitted!');
    setRating(0);
    setComment('');
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-medium text-gray-900 mb-4">{t('gig.writeReview')}</h3>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">{lang === 'fr' ? 'Votre note' : 'Your Rating'}</label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">{lang === 'fr' ? 'Votre avis' : 'Your Review'}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={lang === 'fr' ? 'Partagez votre experience avec ce service...' : 'Share your experience with this service...'}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDone}
          className="py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('profile.cancel')}
        </button>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
        >
          {lang === 'fr' ? 'Soumettre' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}

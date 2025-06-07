'use client'

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: { stars: number; description: string }) => Promise<void>;
  productName: string;
  isSubmitting?: boolean;
}

export default function RatingModal({ isOpen, onClose, onSubmit, productName, isSubmitting = false }: RatingModalProps) {
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) return;
    await onSubmit({ stars, description });
    setStars(0);
    setDescription('');
  };

  const getStarText = (count: number) => {
    if (count === 0) return t('ratingModal.selectRating');
    const key = count === 1 ? 'ratingModal.starCount.singular' : 'ratingModal.starCount.plural';
    return t(key).replace('{{count}}', count.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} p-6 w-full max-w-md rounded-xl shadow-lg transform transition-all duration-300 ease-out scale-100 opacity-100`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('ratingModal.rateProduct').replace('{{productName}}', productName)}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setStars(star)}
                  className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
                >
                  {star <= (hoveredStar || stars) ? (
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="w-8 h-8 text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {getStarText(stars)}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              {t('ratingModal.yourReview')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 
                ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
              rows={4}
              placeholder={t('ratingModal.reviewPlaceholder')}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-200`}
            >
              {t('ratingModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={stars === 0 || isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center transition-all duration-200
                ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-black/80'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('ratingModal.submitting')}</span>
                </>
              ) : (
                t('ratingModal.submitReview')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
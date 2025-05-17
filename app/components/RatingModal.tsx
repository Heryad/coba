import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: { stars: number; description: string }) => void;
  productName: string;
}

export default function RatingModal({ isOpen, onClose, onSubmit, productName }: RatingModalProps) {
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ stars, description });
    setStars(0);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rate: {productName}</h2>
        
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
                  className="focus:outline-none"
                >
                  {star <= (hoveredStar || stars) ? (
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="w-8 h-8 text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {stars === 0 ? 'Select a rating' : `${stars} star${stars > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Share your experience with this product..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={stars === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-black/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
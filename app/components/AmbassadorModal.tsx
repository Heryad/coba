import { useState } from 'react';
import Button from './Button';
import { useToast } from '@/app/context/ToastContext';

interface AmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  refLink: string;
}

export default function AmbassadorModal({ isOpen, onClose, refLink }: AmbassadorModalProps) {
  const { addToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setIsCopied(true);
    addToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ambassador Program</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Program Benefits</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Earn 10% commission on all sales from your referrals
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Get paid directly to your account
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Track your earnings in real-time
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Your Referral Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={refLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="primary"
                size="sm"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Share your unique referral link with friends</li>
              <li>When they sign up and make a purchase, you earn 10%</li>
              <li>Commission is automatically credited to your account</li>
              <li>Withdraw your earnings anytime</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 
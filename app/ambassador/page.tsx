'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import { useToast } from '@/app/context/ToastContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Button from '@/app/components/Button';
import Link from 'next/link';
import { useState } from 'react';

// Define types for the translations
interface FAQItem {
  question: string;
  answer: string;
}

interface AmbassadorTranslations {
  hero: {
    title: string;
    subtitle: string;
  };
  benefits: {
    title: string;
    items: {
      commission: string;
      payment: string;
      tracking: string;
    };
  };
  howItWorks: {
    title: string;
    steps: {
      share: string;
      earn: string;
      credit: string;
      withdraw: string;
    };
  };
  referralLink: {
    title: string;
    description: string;
    copyButton: string;
    copiedButton: string;
    proTip: string;
    signInPrompt: string;
    signInButton: string;
    signUpButton: string;
  };
  stats: {
    totalAmbassadors: string;
    totalAmbassadorsValue: string;
    commissionPaid: string;
    commissionPaidValue: string;
    averageEarnings: string;
    averageEarningsValue: string;
  };
  faq: {
    title: string;
    questions: {
      howToEarn: FAQItem;
      whenPaid: FAQItem;
      linkDuration: FAQItem;
      tracking: FAQItem;
    };
  };
}

interface Translations {
  ambassador: AmbassadorTranslations;
  [key: string]: any;
}

export default function AmbassadorPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const { translations } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const refLink = user ? `${process.env.NEXT_PUBLIC_APP_URL}/auth?tab=signup&ref=${user.id}` : '';

  // Helper function to get translations
  const t = (key: string) => {
    const value = key.split('.').reduce((o, i) => o?.[i], translations);
    return (typeof value === 'string' ? value : key) as string;
  };

  // Cast translations to our type
  const typedTranslations = translations as Translations;

  const handleCopyLink = () => {
    if (!refLink) return;
    navigator.clipboard.writeText(refLink);
    setIsCopied(true);
    addToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black to-gray-900 py-24">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t('ambassador.hero.title')}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              {t('ambassador.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefits Card */}
          <div className={`rounded-2xl shadow-lg overflow-hidden ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <div className={`px-6 py-8 ${isDark ? 'border-b border-gray-700' : 'border-b'}`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('ambassador.benefits.title')}
              </h2>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-4">
                {Object.values(typedTranslations.ambassador.benefits.items).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How It Works Card */}
          <div className={`rounded-2xl shadow-lg overflow-hidden ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <div className={`px-6 py-8 ${isDark ? 'border-b border-gray-700' : 'border-b'}`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('ambassador.howItWorks.title')}
              </h2>
            </div>
            <div className="px-6 py-6">
              <ol className="space-y-4">
                {Object.values(typedTranslations.ambassador.howItWorks.steps).map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                      <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>{index + 1}</span>
                    </span>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Referral Link Card */}
          <div className={`rounded-2xl shadow-lg overflow-hidden ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <div className={`px-6 py-8 ${isDark ? 'border-b border-gray-700' : 'border-b'}`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('ambassador.referralLink.title')}
              </h2>
            </div>
            <div className="px-6 py-6">
              {user ? (
                <div className="space-y-4">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('ambassador.referralLink.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={refLink}
                      readOnly
                      className={`flex-1 px-4 py-2 rounded-md text-sm ${
                        isDark 
                          ? 'bg-[#333] border-gray-600 text-gray-300' 
                          : 'border border-gray-300 text-gray-900'
                      }`}
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="primary"
                    >
                      {isCopied ? t('ambassador.referralLink.copiedButton') : t('ambassador.referralLink.copyButton')}
                    </Button>
                  </div>
                  <div className={`mt-4 p-4 rounded-md ${isDark ? 'bg-[#333]' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                      {t('ambassador.referralLink.proTip')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('ambassador.referralLink.signInPrompt')}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link href="/auth?tab=login">
                      <Button variant="primary">{t('ambassador.referralLink.signInButton')}</Button>
                    </Link>
                    <Link href="/auth?tab=signup">
                      <Button variant="secondary">{t('ambassador.referralLink.signUpButton')}</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              label: t('ambassador.stats.totalAmbassadors'), 
              value: t('ambassador.stats.totalAmbassadorsValue') 
            },
            { 
              label: t('ambassador.stats.commissionPaid'), 
              value: t('ambassador.stats.commissionPaidValue') 
            },
            { 
              label: t('ambassador.stats.averageEarnings'), 
              value: t('ambassador.stats.averageEarningsValue') 
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl text-center ${
                isDark 
                  ? 'bg-gradient-to-br from-[#333] to-[#2A2A2A]' 
                  : 'bg-gradient-to-br from-white to-gray-50'
              } shadow-lg`}
            >
              <dt className={`text-base font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </dt>
              <dd className={`mt-2 text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </dd>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('ambassador.faq.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(typedTranslations.ambassador.faq.questions).map((faq, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl ${isDark ? 'bg-[#2A2A2A]' : 'bg-white'} shadow-lg`}
              >
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
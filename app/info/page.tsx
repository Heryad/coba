'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function InfoPageContent() {
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { translations } = useLanguage();

  // Helper function to get translations
  const t = (key: string, params?: Record<string, any>) => {
    let value = key.split('.').reduce((o: any, i) => o?.[i], translations);
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = (value as string).replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    return (typeof value === 'string' ? value : key);
  };

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Us Section */}
        <section id="about" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t('info.about.title')}</h2>
          <div className="prose prose-lg max-w-none">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.about.whatIs.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.about.whatIs.description')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.about.howWorks.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.about.howWorks.description')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.about.benefits.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.about.benefits.description')}
            </p>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 space-y-2`}>
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>{t(`info.about.benefits.list.${i}`)}</li>
              ))}
            </ul>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.about.printing.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {t('info.about.printing.description')}
            </p>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
              {['dtf', 'dtg', 'sublimation', 'screen', 'embroidery', 'vinyl'].map((method) => (
                <li key={method}>
                  <span className="font-medium">{t(`info.about.printing.methods.${method}.name`)}:</span>{' '}
                  {t(`info.about.printing.methods.${method}.description`)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Return Policy Section */}
        <section id="returns" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t('info.returns.title')}</h2>
          <div className="prose prose-lg max-w-none">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {t('info.returns.lastUpdated')}
            </p>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.returns.intro')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.returns.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.returns.returns.description')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.process.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {t('info.returns.process.description')}{' '}
              <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                customersupport@cobatshirts.com
              </a>
            </p>
            <div className={`${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-50'} p-6 rounded-lg mb-6`}>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-600'} font-medium`}>{t('info.returns.address.name')}</p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('info.returns.address.attn')}</p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('info.returns.address.location')}</p>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.returns.process.note')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.refunds.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('info.returns.refunds.description')}
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.exceptions.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              {t('info.returns.exceptions.description')}
            </p>

            <h4 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.notes.title')}</h4>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 space-y-2`}>
              {[1, 2].map((i) => (
                <li key={i}>{t(`info.returns.notes.list.${i}`)}</li>
              ))}
            </ul>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.returns.questions.title')}</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('info.returns.questions.description')}{' '}
              <a href="tel:+251938613544" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                +251938613544
              </a>{' '}
              {t('info.returns.questions.or')}{' '}
              <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                customersupport@cobatshirts.com
              </a>
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{t('info.contact.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{t('info.contact.getInTouch.title')}</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  {t('info.contact.getInTouch.description')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('info.contact.phone.title')}</h4>
                    <a href="tel:+251938613544" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                      +251 938 61 35 44
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('info.contact.email.title')}</h4>
                    <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                      customersupport@cobatshirts.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`${isDark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-lg p-6`}>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    {t('info.contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder={t('info.contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    {t('info.contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder={t('info.contact.form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    {t('info.contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder={t('info.contact.form.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    {t('info.contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder={t('info.contact.form.messagePlaceholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-md transition-colors duration-200 ${
                    isDark
                      ? 'bg-white text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20'
                      : 'bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20'
                  }`}
                >
                  {t('info.contact.form.submit')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function InfoPage() {
  const { isDark } = useTheme();
  
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    }>
      <InfoPageContent />
    </Suspense>
  );
} 
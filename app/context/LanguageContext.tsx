'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageContextType = {
  translations: Record<string, any>;
  t: (key: string) => string;
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language_preference';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize language from localStorage if available, otherwise default to 'en'
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      return (savedLanguage === 'en' || savedLanguage === 'am') ? savedLanguage : 'en';
    }
    return 'en';
  });
  
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    // Load translations based on selected language
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to empty translations object
        setTranslations({});
      }
    };

    loadTranslations();
  }, [language]);

  const value = {
    translations,
    t: (key: string) => {
      const getNestedValue = (obj: any, path: string) => {
        const value = path.split('.').reduce((acc, part) => {
          return acc && acc[part];
        }, obj);
        return typeof value === 'string' ? value : key;
      };
      return getNestedValue(translations, key);
    },
    currentLanguage: language,
    changeLanguage: setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Custom hook to get translated text
export function useTranslation(key: string) {
  const { translations } = useLanguage();
  
  const getNestedValue = (obj: any, path: string) => {
    const value = path.split('.').reduce((acc, part) => {
      return acc && acc[part];
    }, obj);
    return typeof value === 'string' ? value : key;
  };

  return getNestedValue(translations, key);
} 
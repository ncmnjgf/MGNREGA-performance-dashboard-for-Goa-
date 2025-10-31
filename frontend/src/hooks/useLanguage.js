import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LANGUAGES, 
  getCurrentLanguage, 
  setCurrentLanguage, 
  translate, 
  formatNumber, 
  formatCurrency, 
  formatDate 
} from '../utils/languages';

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLang] = useState(getCurrentLanguage);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set up language on mount
    const lang = getCurrentLanguage();
    setCurrentLang(lang);
    setIsRTL(LANGUAGES[lang]?.dir === 'rtl');
    
    // Apply language to document
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGES[lang]?.dir || 'ltr';
  }, []);

  const changeLanguage = (langCode) => {
    if (LANGUAGES[langCode]) {
      setCurrentLanguage(langCode);
      setCurrentLang(langCode);
      setIsRTL(LANGUAGES[langCode].dir === 'rtl');
    }
  };

  const t = (key) => translate(key, currentLanguage);

  const value = {
    currentLanguage,
    isRTL,
    availableLanguages: LANGUAGES,
    changeLanguage,
    translate: t,
    formatNumber: (num) => formatNumber(num, currentLanguage),
    formatCurrency: (amount) => formatCurrency(amount, currentLanguage),
    formatDate: (date) => formatDate(date, currentLanguage)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

// Higher-order component for class components
export const withLanguage = (Component) => {
  return function WrappedComponent(props) {
    const languageProps = useLanguage();
    return <Component {...props} {...languageProps} />;
  };
};

export default useLanguage;
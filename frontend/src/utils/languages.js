// Multi-language support for MGNREGA Goa Dashboard
// Optimized for low-literacy users with simple, clear language

export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    dir: 'ltr'
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    dir: 'ltr'
  },
  kok: {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    flag: '🇮🇳',
    dir: 'ltr'
  }
};

export const TRANSLATIONS = {
  en: {
    // App Title and Navigation
    appTitle: "MGNREGA Goa Dashboard",
    appSubtitle: "Track Rural Employment & Development",
    
    // Navigation
    home: "Home",
    about: "About",
    help: "Help",
    
    // Common Actions
    refresh: "Refresh",
    loading: "Loading...",
    error: "Error",
    retry: "Try Again",
    close: "Close",
    select: "Select",
    search: "Search",
    
    // Connection Status
    connected: "Connected",
    offline: "Offline",
    limited: "Limited Connection",
    
    // District Selection
    selectDistrict: "Choose Your Area",
    northGoa: "North Goa",
    southGoa: "South Goa",
    autoDetect: "Find My Location",
    detectingLocation: "Finding your location...",
    locationError: "Cannot find location",
    
    // Metrics - Using Simple Language
    workDone: "Work Done",
    workDoneUnit: "Days",
    workDoneDesc: "Total days of work provided",
    
    familiesHelped: "Families Helped",
    familiesHelpedUnit: "Families",
    familiesHelpedDesc: "Number of families who got work",
    
    moneySpent: "Money Spent",
    moneySpentUnit: "₹",
    moneySpentDesc: "Total money spent on work",
    
    avgWage: "Daily Wage",
    avgWageUnit: "₹/Day",
    avgWageDesc: "Average money paid per day",
    
    completion: "Work Completed",
    completionUnit: "%",
    completionDesc: "Percentage of planned work finished",
    
    // Time periods
    thisMonth: "This Month",
    lastMonth: "Last Month",
    thisYear: "This Year",
    
    // Charts
    monthlyTrend: "Monthly Progress",
    comparison: "Compare Areas",
    showComparison: "Compare Districts",
    hideComparison: "Hide Comparison",
    
    // Months
    months: {
      1: "January", 2: "February", 3: "March", 4: "April",
      5: "May", 6: "June", 7: "July", 8: "August",
      9: "September", 10: "October", 11: "November", 12: "December"
    },
    
    monthsShort: {
      1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
      5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
      9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
    },
    
    // Status Messages
    dataUpdated: "Data updated",
    lastUpdated: "Last updated",
    noData: "No data available",
    noDataDesc: "Data not found for this area",
    
    // Numbers formatting
    lakh: "Lakh",
    crore: "Crore",
    thousand: "Thousand",
    
    // Insights
    insights: "Key Points",
    goodProgress: "📈 Great! Work is increasing",
    steadyProgress: "📊 Work is steady",
    needsAttention: "📉 Work is decreasing",
    
    // Accessibility
    skipToContent: "Skip to main content",
    backToTop: "Back to top",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    
    // Settings
    settings: "Settings",
    language: "Language",
    fontSize: "Text Size",
    fontSizeSmall: "Small",
    fontSizeMedium: "Medium", 
    fontSizeLarge: "Large",
    fontSizeXLarge: "Extra Large",
    
    // Auto-refresh
    autoRefresh: "Auto Update",
    autoRefreshOn: "Auto Update On",
    autoRefreshOff: "Auto Update Off",
    
    // Errors
    errorTitle: "Something went wrong",
    errorDesc: "Please try again or check your internet connection",
    connectionError: "No internet connection",
    connectionErrorDesc: "Using saved data. Connect to internet for latest updates.",
    
    // Help text
    helpWorkDone: "This shows the total number of days people worked under MGNREGA scheme",
    helpFamilies: "This shows how many families got employment through MGNREGA",
    helpMoney: "This shows the total amount of money spent on MGNREGA works",
    helpWage: "This shows the average money paid to workers per day",
    helpCompletion: "This shows how much of the planned work has been completed"
  },
  
  hi: {
    // App Title and Navigation
    appTitle: "मनरेगा गोवा डैशबोर्ड",
    appSubtitle: "ग्रामीण रोजगार और विकास की जानकारी",
    
    // Navigation
    home: "मुख्य",
    about: "जानकारी",
    help: "सहायता",
    
    // Common Actions
    refresh: "नवीकरण",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    retry: "दोबारा कोशिश करें",
    close: "बंद करें",
    select: "चुनें",
    search: "खोजें",
    
    // Connection Status
    connected: "जुड़ा हुआ",
    offline: "ऑफलाइन",
    limited: "सीमित कनेक्शन",
    
    // District Selection
    selectDistrict: "अपना इलाका चुनें",
    northGoa: "उत्तर गोवा",
    southGoa: "दक्षिण गोवा",
    autoDetect: "मेरी स्थिति खोजें",
    detectingLocation: "आपकी स्थिति खोजी जा रही है...",
    locationError: "स्थिति नहीं मिली",
    
    // Metrics - Using Simple Language
    workDone: "काम हुआ",
    workDoneUnit: "दिन",
    workDoneDesc: "कुल कितने दिन काम मिला",
    
    familiesHelped: "परिवारों को मदद",
    familiesHelpedUnit: "परिवार",
    familiesHelpedDesc: "कितने परिवारों को काम मिला",
    
    moneySpent: "पैसा खर्च",
    moneySpentUnit: "₹",
    moneySpentDesc: "काम पर कुल पैसा खर्च",
    
    avgWage: "दैनिक मजदूरी",
    avgWageUnit: "₹/दिन",
    avgWageDesc: "प्रति दिन औसत मजदूरी",
    
    completion: "काम पूरा",
    completionUnit: "%",
    completionDesc: "कितना काम पूरा हुआ",
    
    // Time periods
    thisMonth: "इस महीने",
    lastMonth: "पिछले महीने",
    thisYear: "इस साल",
    
    // Charts
    monthlyTrend: "मासिक प्रगति",
    comparison: "इलाकों की तुलना",
    showComparison: "तुलना दिखाएं",
    hideComparison: "तुलना छुपाएं",
    
    // Months
    months: {
      1: "जनवरी", 2: "फरवरी", 3: "मार्च", 4: "अप्रैल",
      5: "मई", 6: "जून", 7: "जुलाई", 8: "अगस्त",
      9: "सितंबर", 10: "अक्टूबर", 11: "नवंबर", 12: "दिसंबर"
    },
    
    monthsShort: {
      1: "जन", 2: "फर", 3: "मार", 4: "अप्र",
      5: "मई", 6: "जून", 7: "जुल", 8: "अग",
      9: "सित", 10: "अक्ट", 11: "नव", 12: "दिस"
    },
    
    // Status Messages
    dataUpdated: "डेटा अपडेट हुआ",
    lastUpdated: "अंतिम अपडेट",
    noData: "डेटा उपलब्ध नहीं",
    noDataDesc: "इस इलाके का डेटा नहीं मिला",
    
    // Numbers formatting
    lakh: "लाख",
    crore: "करोड़",
    thousand: "हजार",
    
    // Insights
    insights: "मुख्य बातें",
    goodProgress: "📈 बहुत बढ़िया! काम बढ़ रहा है",
    steadyProgress: "📊 काम स्थिर है",
    needsAttention: "📉 काम कम हो रहा है",
    
    // Settings
    settings: "सेटिंग्स",
    language: "भाषा",
    fontSize: "अक्षर का आकार",
    fontSizeSmall: "छोटा",
    fontSizeMedium: "मध्यम",
    fontSizeLarge: "बड़ा", 
    fontSizeXLarge: "बहुत बड़ा",
    
    // Auto-refresh
    autoRefresh: "स्वयं अपडेट",
    autoRefreshOn: "स्वयं अपडेट चालू",
    autoRefreshOff: "स्वयं अपडेट बंद",
    
    // Errors
    errorTitle: "कुछ गलत हुआ",
    errorDesc: "कृपया दोबारा कोशिश करें या इंटरनेट कनेक्शन जांचें",
    connectionError: "इंटरनेट कनेक्शन नहीं",
    connectionErrorDesc: "सहेजा गया डेटा दिखा रहे हैं। नवीनतम अपडेट के लिए इंटरनेट से जुड़ें।"
  },
  
  mr: {
    // App Title and Navigation  
    appTitle: "मनरेगा गोवा डॅशबोर्ड",
    appSubtitle: "ग्रामीण रोजगार आणि विकासाची माहिती",
    
    // Navigation
    home: "मुख्य",
    about: "माहिती",
    help: "मदत",
    
    // Common Actions
    refresh: "नवीकरण",
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    retry: "पुन्हा प्रयत्न करा",
    close: "बंद करा",
    select: "निवडा",
    search: "शोधा",
    
    // Connection Status
    connected: "जोडले",
    offline: "ऑफलाइन",
    limited: "मर्यादित कनेक्शन",
    
    // District Selection
    selectDistrict: "तुमचा भाग निवडा",
    northGoa: "उत्तर गोवा",
    southGoa: "दक्षिण गोवा", 
    autoDetect: "माझे स्थान शोधा",
    detectingLocation: "तुमचे स्थान शोधत आहे...",
    locationError: "स्थान सापडले नाही",
    
    // Metrics
    workDone: "काम झाले",
    workDoneUnit: "दिवस",
    workDoneDesc: "एकूण किती दिवस काम मिळाले",
    
    familiesHelped: "कुटुंबांना मदत",
    familiesHelpedUnit: "कुटुंबे",
    familiesHelpedDesc: "किती कुटुंबांना काम मिळाले",
    
    moneySpent: "पैसे खर्च",
    moneySpentUnit: "₹",
    moneySpentDesc: "कामावर एकूण पैसे खर्च",
    
    avgWage: "दैनंदिन मजुरी",
    avgWageUnit: "₹/दिवस",
    avgWageDesc: "प्रतिदिन सरासरी मजुरी",
    
    completion: "काम पूर्ण",
    completionUnit: "%",
    completionDesc: "किती काम पूर्ण झाले",
    
    // Time periods
    thisMonth: "या महिन्यात",
    lastMonth: "गेल्या महिन्यात", 
    thisYear: "या वर्षी",
    
    // Charts
    monthlyTrend: "मासिक प्रगती",
    comparison: "भागांची तुलना",
    showComparison: "तुलना दाखवा",
    hideComparison: "तुलना लपवा",
    
    // Months
    months: {
      1: "जानेवारी", 2: "फेब्रुवारी", 3: "मार्च", 4: "एप्रिल",
      5: "मे", 6: "जून", 7: "जुलै", 8: "ऑगस्ट", 
      9: "सप्टेंबर", 10: "ऑक्टोबर", 11: "नोव्हेंबर", 12: "डिसेंबर"
    },
    
    // Insights
    insights: "मुख्य मुद्दे",
    goodProgress: "📈 छान! काम वाढत आहे",
    steadyProgress: "📊 काम स्थिर आहे", 
    needsAttention: "📉 काम कमी होत आहे"
  },
  
  kok: {
    // App Title and Navigation
    appTitle: "मनरेगा गोंय डॅशबोर्ड", 
    appSubtitle: "ग्रामीण रोजगार आनी विकासाची माहिती",
    
    // Navigation
    home: "मुख्य",
    about: "माहिती", 
    help: "आदार",
    
    // Common Actions
    refresh: "नवीकरण",
    loading: "लोड जातां...",
    error: "चुक",
    retry: "परतून करून पळेयात",
    close: "बंद करात",
    select: "निवडात",
    search: "सोदात",
    
    // District Selection
    selectDistrict: "तुमचो वाटार निवडात",
    northGoa: "उत्तर गोंय",
    southGoa: "दक्षिण गोंय",
    autoDetect: "म्होजो ठिकाण सोदात",
    
    // Metrics
    workDone: "काम जालें",
    workDoneUnit: "दिस",
    workDoneDesc: "एकूण कितले दिस काम मेळ्ळें",
    
    familiesHelped: "कुटुंबांक आदार",
    familiesHelpedUnit: "कुटुंबां",
    familiesHelpedDesc: "कितलीं कुटुंबां काम मेळ्ळें",
    
    moneySpent: "पैसे खर्च",
    moneySpentUnit: "₹",
    moneySpentDesc: "कामाचेर एकूण पैसे खर्च",
    
    // Insights
    insights: "मुख्य गजाली",
    goodProgress: "📈 बरें! काम वाडत आसा",
    steadyProgress: "📊 काम स्थिर आसा",
    needsAttention: "📉 काम उणें जातां"
  }
};

// Language utility functions
export const getCurrentLanguage = () => {
  const saved = localStorage.getItem('mgnrega-language');
  return saved || 'en';
};

export const setCurrentLanguage = (langCode) => {
  localStorage.setItem('mgnrega-language', langCode);
  // Update HTML lang attribute for accessibility
  document.documentElement.lang = langCode;
  document.documentElement.dir = LANGUAGES[langCode]?.dir || 'ltr';
};

export const translate = (key, langCode = null) => {
  const currentLang = langCode || getCurrentLanguage();
  const translation = TRANSLATIONS[currentLang];
  
  // Handle nested keys like "months.1"
  const keys = key.split('.');
  let result = translation;
  
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) break;
  }
  
  // Fallback to English if translation not found
  if (result === undefined && currentLang !== 'en') {
    return translate(key, 'en');
  }
  
  return result || key;
};

// Number formatting with Indian numbering system
export const formatNumber = (num, langCode = null) => {
  const currentLang = langCode || getCurrentLanguage();
  
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  const absNum = Math.abs(num);
  
  if (absNum >= 10000000) { // 1 crore
    return `${(num / 10000000).toFixed(1)} ${translate('crore', currentLang)}`;
  } else if (absNum >= 100000) { // 1 lakh
    return `${(num / 100000).toFixed(1)} ${translate('lakh', currentLang)}`;
  } else if (absNum >= 1000) { // 1 thousand
    return `${(num / 1000).toFixed(1)} ${translate('thousand', currentLang)}`;
  }
  
  return num.toLocaleString();
};

// Format currency for Indian context
export const formatCurrency = (amount, langCode = null) => {
  const formatted = formatNumber(amount, langCode);
  return `₹${formatted}`;
};

// Date formatting with localization
export const formatDate = (date, langCode = null) => {
  const currentLang = langCode || getCurrentLanguage();
  const d = new Date(date);
  
  const month = translate(`months.${d.getMonth() + 1}`, currentLang);
  const year = d.getFullYear();
  
  return `${month} ${year}`;
};

export default {
  LANGUAGES,
  TRANSLATIONS,
  getCurrentLanguage,
  setCurrentLanguage,
  translate,
  formatNumber,
  formatCurrency,
  formatDate
};
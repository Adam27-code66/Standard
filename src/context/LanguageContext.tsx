'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LangCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml';

export interface LangMeta {
  code: LangCode;
  label: string;
  name: string;
  flag: string;
}

export const LANGUAGES: LangMeta[] = [
  { code: 'en', label: 'EN', name: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'हि', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'த', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'తె', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕ', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'മ', name: 'മലയാളം', flag: '🇮🇳' },
];

// ── Translated UI strings ─────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Record<string, string>> = {
  en: {
    product: 'Product / Service',
    productPlaceholder: 'e.g. Outdoor LED Street Light, Industrial Water Pump',
    purpose: 'Purpose / Application',
    purposePlaceholder: 'e.g. Highway street lighting for NH infrastructure project',
    techReq: 'Technical Requirements',
    techReqPlaceholder: 'Enter technical requirements, one per line:\nPower rating: 100W\nIP rating: IP65 or higher\nDesign life: 50,000 hours',
    environment: 'Operating Environment',
    envPlaceholder: 'e.g. Outdoor / Coastal / Monsoon conditions',
    industry: 'Industry / Sector',
    analyzeBtn: 'Analyze with AI',
    chatPlaceholder: 'Describe your requirement or ask about standards...',
    chatGreeting: "Hello! I'm the IS-SMART Procurement Assistant. I can help identify applicable Indian Standards for your procurement requirement. What product or equipment do you need standards for?",
    regionalNote: 'You can also type requirements in regional languages (Tamil, Hindi, Telugu, Kannada, Malayalam).',
  },
  hi: {
    product: 'उत्पाद / सेवा',
    productPlaceholder: 'उदा. आउटडोर LED स्ट्रीट लाइट, औद्योगिक जल पंप',
    purpose: 'उद्देश्य / अनुप्रयोग',
    purposePlaceholder: 'उदा. राष्ट्रीय राजमार्ग बुनियादी ढांचे के लिए सड़क प्रकाश',
    techReq: 'तकनीकी आवश्यकताएं',
    techReqPlaceholder: 'तकनीकी आवश्यकताएं दर्ज करें:\nबिजली रेटिंग: 100W\nआईपी रेटिंग: IP65 या अधिक\nडिज़ाइन जीवन: 50,000 घंटे',
    environment: 'परिचालन वातावरण',
    envPlaceholder: 'उदा. आउटडोर / तटीय / मानसून की स्थिति',
    industry: 'उद्योग / क्षेत्र',
    analyzeBtn: 'AI से विश्लेषण करें',
    chatPlaceholder: 'अपनी आवश्यकता बताएं या मानकों के बारे में पूछें...',
    chatGreeting: 'नमस्ते! मैं IS-SMART खरीद सहायक हूं। मैं आपकी खरीद आवश्यकता के लिए लागू भारतीय मानकों की पहचान करने में मदद कर सकता हूं। आपको किस उत्पाद के लिए मानकों की आवश्यकता है?',
    regionalNote: 'आप हिंदी, तमिल, तेलुगु, कन्नड़ या मलयालम में आवश्यकताएं भी टाइप कर सकते हैं।',
  },
  ta: {
    product: 'தயாரிப்பு / சேவை',
    productPlaceholder: 'எ.கா. LED சாலை விளக்கு, தொழிற்துறை நீர் பம்ப்',
    purpose: 'நோக்கம் / பயன்பாடு',
    purposePlaceholder: 'எ.கா. தேசிய நெடுஞ்சாலை உள்கட்டமைப்பிற்கான சாலை விளக்கு',
    techReq: 'தொழில்நுட்ப தேவைகள்',
    techReqPlaceholder: 'தொழில்நுட்ப தேவைகளை உள்ளிடவும்:\nமின் திறன்: 100W\nIP மதிப்பீடு: IP65 அல்லது அதிகம்\nவடிவமைப்பு ஆயுள்: 50,000 மணி நேரம்',
    environment: 'இயக்க சூழல்',
    envPlaceholder: 'எ.கா. வெளிப்புற / கடலோர / மழைக்காலம்',
    industry: 'தொழில் / துறை',
    analyzeBtn: 'AI மூலம் பகுப்பாய்வு செய்யுங்கள்',
    chatPlaceholder: 'உங்கள் தேவையை விவரிக்கவும் அல்லது தரநிலைகளைப் பற்றி கேளுங்கள்...',
    chatGreeting: 'வணக்கம்! நான் IS-SMART கொள்முதல் உதவியாளர். உங்கள் தேவைகளுக்கு பொருந்தும் இந்திய தரநிலைகளை கண்டறிய உதவுவேன். எந்த தயாரிப்புக்கு தரநிலைகள் தேவை?',
    regionalNote: 'தமிழ், ஹிந்தி, தெலுங்கு, கன்னடம் அல்லது மலையாளத்திலும் உள்ளிடலாம்.',
  },
  te: {
    product: 'ఉత్పత్తి / సేవ',
    productPlaceholder: 'ఉదా. LED వీధి దీపాలు, పారిశ్రామిక నీటి పంప్',
    purpose: 'ఉద్దేశ్యం / అప్లికేషన్',
    purposePlaceholder: 'ఉదా. జాతీయ రహదారి మౌలిక సదుపాయాల కోసం రోడ్ లైటింగ్',
    techReq: 'సాంకేతిక అవసరాలు',
    techReqPlaceholder: 'సాంకేతిక అవసరాలను నమోదు చేయండి:\nశక్తి రేటింగ్: 100W\nIP రేటింగ్: IP65 లేదా అంతకంటే ఎక్కువ',
    environment: 'ఆపరేటింగ్ వాతావరణం',
    envPlaceholder: 'ఉదా. ఔట్‌డోర్ / తీర ప్రాంతం / వర్షాకాల పరిస్థితులు',
    industry: 'పరిశ్రమ / రంగం',
    analyzeBtn: 'AI తో విశ్లేషించండి',
    chatPlaceholder: 'మీ అవసరాన్ని వివరించండి లేదా ప్రమాణాల గురించి అడగండి...',
    chatGreeting: 'నమస్కారం! నేను IS-SMART సేకరణ సహాయకుడు. మీ అవసరాలకు వర్తించే భారతీయ ప్రమాణాలను గుర్తించడంలో సహాయపడతాను.',
    regionalNote: 'తెలుగు, హిందీ, తమిళం, కన్నడ లేదా మలయాళంలో కూడా నమోదు చేయవచ్చు.',
  },
  kn: {
    product: 'ಉತ್ಪನ್ನ / ಸೇವೆ',
    productPlaceholder: 'ಉದಾ. LED ಬೀದಿ ದೀಪ, ಕೈಗಾರಿಕಾ ನೀರಿನ ಪಂಪ್',
    purpose: 'ಉದ್ದೇಶ / ಅಪ್ಲಿಕೇಶನ್',
    purposePlaceholder: 'ಉದಾ. ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಮೂಲಸೌಕರ್ಯಕ್ಕಾಗಿ ರಸ್ತೆ ಬೆಳಕು',
    techReq: 'ತಾಂತ್ರಿಕ ಅವಶ್ಯಕತೆಗಳು',
    techReqPlaceholder: 'ತಾಂತ್ರಿಕ ಅವಶ್ಯಕತೆಗಳನ್ನು ನಮೂದಿಸಿ:\nವಿದ್ಯುತ್ ರೇಟಿಂಗ್: 100W\nIP ರೇಟಿಂಗ್: IP65 ಅಥವಾ ಹೆಚ್ಚು',
    environment: 'ಆಪರೇಟಿಂಗ್ ಪರಿಸರ',
    envPlaceholder: 'ಉದಾ. ಹೊರಾಂಗಣ / ಕರಾವಳಿ / ಮಳೆಗಾಲದ ಪರಿಸ್ಥಿತಿಗಳು',
    industry: 'ಉದ್ಯಮ / ಕ್ಷೇತ್ರ',
    analyzeBtn: 'AI ಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಿ',
    chatPlaceholder: 'ನಿಮ್ಮ ಅವಶ್ಯಕತೆಯನ್ನು ವಿವರಿಸಿ ಅಥವಾ ಮಾನದಂಡಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    chatGreeting: 'ನಮಸ್ಕಾರ! ನಾನು IS-SMART ಖರೀದಿ ಸಹಾಯಕ. ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಅನ್ವಯಿಸುವ ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ಗುರುತಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    regionalNote: 'ಕನ್ನಡ, ಹಿಂದಿ, ತಮಿಳು, ತೆಲುಗು ಅಥವಾ ಮಲಯಾಳಂನಲ್ಲೂ ನಮೂದಿಸಬಹುದು.',
  },
  ml: {
    product: 'ഉൽപ്പന്നം / സേവനം',
    productPlaceholder: 'ഉദാ. LED തെരുവ് വിളക്ക്, വ്യാവസായിക ജലപമ്പ്',
    purpose: 'ഉദ്ദേശ്യം / ആപ്ലിക്കേഷൻ',
    purposePlaceholder: 'ഉദാ. ദേശീയ പാതാ അടിസ്ഥാന സൗകര്യത്തിനുള്ള റോഡ് ലൈറ്റിംഗ്',
    techReq: 'സാങ്കേതിക ആവശ്യകതകൾ',
    techReqPlaceholder: 'സാങ്കേതിക ആവശ്യകതകൾ നൽകുക:\nശക്തി റേറ്റിംഗ്: 100W\nIP റേറ്റിംഗ്: IP65 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ',
    environment: 'പ്രവർത്തന പരിതസ്ഥിതി',
    envPlaceholder: 'ഉദാ. ഔട്ട്ഡോർ / തീരദേശം / മൺസൂൺ അവസ്ഥകൾ',
    industry: 'വ്യവസായം / മേഖല',
    analyzeBtn: 'AI ഉപയോഗിച്ച് വിശകലനം ചെയ്യുക',
    chatPlaceholder: 'നിങ്ങളുടെ ആവശ്യകത വിവരിക്കുക അല്ലെങ്കിൽ മാനദണ്ഡങ്ങളെ കുറിച്ച് ചോദിക്കുക...',
    chatGreeting: 'നമസ്കാരം! ഞാൻ IS-SMART സംഭരണ സഹായിയാണ്. നിങ്ങളുടെ ആവശ്യകതകൾക്ക് ബാധകമായ ഇന്ത്യൻ മാനദണ്ഡങ്ങൾ കണ്ടെത്താൻ ഞാൻ സഹായിക്കാം.',
    regionalNote: 'മലയാളം, ഹിന്ദി, തമിഴ്, തെലുഗു അല്ലെങ്കിൽ കന്നഡയിലും ടൈപ്പ് ചെയ്യാം.',
  },
};

// ── Context ───────────────────────────────────────────────────
interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

const STORAGE_KEY = 'is-smart-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && LANGUAGES.find((l) => l.code === stored)) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  function setLang(code: LangCode) {
    setLangState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }

  function t(key: string): string {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

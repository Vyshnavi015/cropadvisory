"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi" | "bn" | "te" | "mr" | "ta" | "gu" | "kn" | "or" | "pa" | "ml"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isOnline: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isOnline }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Comprehensive translations for all 10 Indian languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Common
    "app.title": "Smart Crop Advisory",
    "nav.dashboard": "Dashboard",
    "nav.cropAdvisory": "Crop Advisory",
    "nav.weather": "Weather",
    "nav.pestDetection": "Pest Detection",
    "nav.marketPrices": "Market Prices",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.next": "Next",
    "common.offline": "Offline Mode",
    "common.online": "Online",

    // Home Page
    "home.title": "Smart Crop Advisory System",
    "home.subtitle": "Empowering Small and Marginal Farmers with AI-Driven Agricultural Solutions",
    "home.getStarted": "Get Started",
    "home.learnMore": "Learn More",
    "home.features.weather": "Weather Forecasting",
    "home.features.pest": "Pest Detection",
    "home.features.market": "Market Prices",
    "home.features.advisory": "Crop Advisory",
    "home.features.multilingual": "Multilingual Support",
    "home.features.offline": "Offline Access",

    // Authentication
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Full Name",
    "auth.phone": "Phone Number",
    "auth.state": "State",
    "auth.district": "District",
    "auth.farmSize": "Farm Size (acres)",
    "auth.language": "Preferred Language",
    "auth.terms": "I agree to the Terms and Conditions",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.weather": "Today's Weather",
    "dashboard.alerts": "Active Alerts",
    "dashboard.cropStatus": "Crop Status",
    "dashboard.tasks": "Today's Tasks",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.temperature": "Temperature",
    "dashboard.humidity": "Humidity",
    "dashboard.wind": "Wind Speed",
    "dashboard.rainfall": "Rainfall",

    // Crop Advisory
    "advisory.title": "Crop Advisory",
    "advisory.getAdvice": "Get Advisory",
    "advisory.recommendations": "Crop Recommendations",
    "advisory.fertilizer": "Fertilizer Guide",
    "advisory.cropType": "Crop Type",
    "advisory.soilType": "Soil Type",
    "advisory.growthStage": "Growth Stage",
    "advisory.getRecommendation": "Get Recommendation",

    // Weather
    "weather.forecast": "7-Day Forecast",
    "weather.alerts": "Weather Alerts",
    "weather.advice": "Farming Advice",
    "weather.current": "Current Conditions",

    // Pest Detection
    "pest.detection": "Pest Detection",
    "pest.history": "Detection History",
    "pest.database": "Pest Database",
    "pest.uploadImage": "Upload Image",
    "pest.takePhoto": "Take Photo",
    "pest.analyze": "Analyze",

    // Market Prices
    "market.currentPrices": "Current Prices",
    "market.trends": "Price Trends",
    "market.insights": "Market Insights",
    "market.topMarkets": "Top Markets",
    "market.selectCrop": "Select Crop",
    "market.selectState": "Select State",

    // Voice Assistant
    "voice.listening": "Listening...",
    "voice.ready": "Ready",
    "voice.transcript": "You said",
    "voice.commands": "Voice Commands",
    "voice.speak": "Speak",
    "voice.stop": "Stop",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language Preferences",
    "settings.notifications": "Notifications",
    "settings.voice": "Voice Settings",
    "settings.offline": "Offline Mode",
    "settings.dataSync": "Data Sync",
    "settings.privacy": "Privacy",
    "settings.about": "About",
    "settings.enableVoice": "Enable Voice Commands",
    "settings.enableTTS": "Enable Text-to-Speech",
    "settings.voiceLanguage": "Voice Language",
    "settings.speechRate": "Speech Rate",
    "settings.enableNotifications": "Enable Notifications",
    "settings.weatherAlerts": "Weather Alerts",
    "settings.pestAlerts": "Pest Alerts",
    "settings.marketAlerts": "Market Price Alerts",
    "settings.offlineMode": "Enable Offline Mode",
    "settings.autoSync": "Auto Sync Data",
    "settings.dataUsage": "Data Usage Settings",

    // Profile
    "profile.title": "Profile",
    "profile.personalInfo": "Personal Information",
    "profile.farmDetails": "Farm Details",
    "profile.preferences": "Preferences",
    "profile.statistics": "Usage Statistics",
    "profile.dataManagement": "Data Management",
    "profile.logout": "Logout",
    "profile.editProfile": "Edit Profile",
    "profile.farmLocation": "Farm Location",
    "profile.cropTypes": "Primary Crops",
    "profile.experience": "Farming Experience",
    "profile.totalQueries": "Total Queries",
    "profile.dataDownloaded": "Data Downloaded",
    "profile.lastSync": "Last Sync",
    "profile.offlineData": "Offline Data Size",

    // Alerts
    "alerts.title": "Alerts & Notifications",
    "alerts.active": "Active Alerts",
    "alerts.history": "Alert History",
    "alerts.settings": "Alert Settings",
    "alerts.weather": "Weather Alerts",
    "alerts.pest": "Pest Alerts",
    "alerts.market": "Market Alerts",
    "alerts.irrigation": "Irrigation Reminders",
    "alerts.fertilizer": "Fertilizer Reminders",
    "alerts.harvest": "Harvest Reminders",
    "alerts.markAsRead": "Mark as Read",
    "alerts.dismiss": "Dismiss",
    "alerts.viewDetails": "View Details",

    // Quick Actions
    "quickActions.pestDetection": "Pest Detection",
    "quickActions.pestDesc": "Upload crop images for AI-powered pest identification",
    "quickActions.soilHealth": "Soil Health",
    "quickActions.soilDesc": "Get soil analysis and improvement recommendations",
    "quickActions.marketPrices": "Market Prices",
    "quickActions.marketDesc": "Check current crop prices in nearby markets",
    "quickActions.cropTimeline": "Crop Timeline",
    "quickActions.timelineDesc": "Track your crop growth stages and activities",
    "quickActions.weatherForecast": "Weather Forecast",
    "quickActions.weatherDesc": "7-day weather forecast with farming advice",
    "quickActions.fertilizer": "Fertilizer Guide",
    "quickActions.fertilizerDesc": "Get personalized fertilizer recommendations",

    autoTTSEnabled: "Auto text-to-speech enabled",
    autoTTSDisabled: "Auto text-to-speech disabled",
    selected: "Selected",
    navigatingTo: "Navigating to",
    pageLoaded: "Page loaded",
    buttonPressed: "Button pressed",
    focusedOn: "Focused on",
    enableAutoTTS: "Enable Auto Text-to-Speech",
    disableAutoTTS: "Disable Auto Text-to-Speech",
    autoTTSOn: "Auto TTS On",
    autoTTSOff: "Auto TTS Off",
    hoveredOver: "Hovered over",
    clicked: "Clicked",
    formField: "Form field",
    menuItem: "Menu item",
    cardContent: "Card content",
    linkText: "Link",
    imageDescription: "Image",
  },

  hi: {
    // Navigation & Common
    "app.title": "स्मार्ट फसल सलाहकार",
    "nav.dashboard": "डैशबोर्ड",
    "nav.cropAdvisory": "फसल सलाह",
    "nav.weather": "मौसम",
    "nav.pestDetection": "कीट पहचान",
    "nav.marketPrices": "बाजार भाव",
    "nav.profile": "प्रोफाइल",
    "nav.settings": "सेटिंग्स",
    "nav.logout": "लॉगआउट",
    "common.loading": "लोड हो रहा है...",
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.submit": "जमा करें",
    "common.back": "वापस",
    "common.next": "आगे",
    "common.offline": "ऑफलाइन मोड",
    "common.online": "ऑनलाइन",

    // Home Page
    "home.title": "स्मार्ट फसल सलाहकार सिस्टम",
    "home.subtitle": "AI-संचालित कृषि समाधानों के साथ छोटे और सीमांत किसानों को सशक्त बनाना",
    "home.getStarted": "शुरू करें",
    "home.learnMore": "और जानें",
    "home.features.weather": "मौसम पूर्वानुमान",
    "home.features.pest": "कीट पहचान",
    "home.features.market": "बाजार भाव",
    "home.features.advisory": "फसल सलाह",
    "home.features.multilingual": "बहुभाषी समर्थन",
    "home.features.offline": "ऑफलाइन पहुंच",

    // Authentication
    "auth.login": "लॉगिन",
    "auth.register": "पंजीकरण",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.confirmPassword": "पासवर्ड की पुष्टि करें",
    "auth.name": "पूरा नाम",
    "auth.phone": "फोन नंबर",
    "auth.state": "राज्य",
    "auth.district": "जिला",
    "auth.farmSize": "खेत का आकार (एकड़)",
    "auth.language": "पसंदीदा भाषा",
    "auth.terms": "मैं नियम और शर्तों से सहमत हूं",

    // Dashboard
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.weather": "आज का मौसम",
    "dashboard.alerts": "सक्रिय अलर्ट",
    "dashboard.cropStatus": "फसल की स्थिति",
    "dashboard.tasks": "आज के कार्य",
    "dashboard.quickActions": "त्वरित कार्य",
    "dashboard.temperature": "तापमान",
    "dashboard.humidity": "नमी",
    "dashboard.wind": "हवा की गति",
    "dashboard.rainfall": "वर्षा",

    // Crop Advisory
    "advisory.title": "फसल सलाह",
    "advisory.getAdvice": "सलाह प्राप्त करें",
    "advisory.recommendations": "फसल की सिफारिशें",
    "advisory.fertilizer": "उर्वरक गाइड",
    "advisory.cropType": "फसल का प्रकार",
    "advisory.soilType": "मिट्टी का प्रकार",
    "advisory.growthStage": "वृद्धि का स्तर",
    "advisory.getRecommendation": "सिफारिश प्राप्त करें",

    // Weather
    "weather.forecast": "7 दिनों का अनुमान",
    "weather.alerts": "मौसम सूचनाएं",
    "weather.advice": "खेती सलाह",
    "weather.current": "वर्तमान स्थिति",

    // Pest Detection
    "pest.detection": "कीट पहचान",
    "pest.history": "पहचान की इतिहास",
    "pest.database": "कीट डेटाबेस",
    "pest.uploadImage": "छवि अपलोड करें",
    "pest.takePhoto": "फोटो ले जाएं",
    "pest.analyze": "विश्लेषण करें",

    // Market Prices
    "market.currentPrices": "वर्तमान कीमतें",
    "market.trends": "कीमतों की तенденशियाँ",
    "market.insights": "बाजार का अनुभव",
    "market.topMarkets": "शीर्ष बाजार",
    "market.selectCrop": "फसल चुनें",
    "market.selectState": "राज्य चुनें",

    // Voice Assistant
    "voice.listening": "सुन रहा है...",
    "voice.ready": "तैयार",
    "voice.transcript": "आपने कहा",
    "voice.commands": "आवाज़ कमांड",
    "voice.speak": "बोलें",
    "voice.stop": "रोकें",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.language": "भाषा प्राथमिकताएं",
    "settings.notifications": "सूचनाएं",
    "settings.voice": "आवाज़ सेटिंग्स",
    "settings.offline": "ऑफलाइन मोड",
    "settings.dataSync": "डेटा सिंक",
    "settings.privacy": "गोपनीयता",
    "settings.about": "के बारे में",
    "settings.enableVoice": "आवाज़ कमांड सक्षम करें",
    "settings.enableTTS": "टेक्स्ट-टू-स्पीच सक्षम करें",
    "settings.voiceLanguage": "आवाज़ की भाषा",
    "settings.speechRate": "बोलने की गति",
    "settings.enableNotifications": "सूचनाएं सक्षम करें",
    "settings.weatherAlerts": "मौसम अलर्ट",
    "settings.pestAlerts": "कीट अलर्ट",
    "settings.marketAlerts": "बाजार भाव अलर्ट",
    "settings.offlineMode": "ऑफलाइन मोड सक्षम करें",
    "settings.autoSync": "ऑटो सिंक डेटा",
    "settings.dataUsage": "डेटा उपयोग सेटिंग्स",

    // Profile
    "profile.title": "प्रोफाइल",
    "profile.personalInfo": "व्यक्तिगत जानकारी",
    "profile.farmDetails": "खेत विवरण",
    "profile.preferences": "प्राथमिकताएं",
    "profile.statistics": "उपयोग आंकड़े",
    "profile.dataManagement": "डेटा प्रबंधन",
    "profile.logout": "लॉगआउट",
    "profile.editProfile": "प्रोफाइल संपादित करें",
    "profile.farmLocation": "खेत का स्थान",
    "profile.cropTypes": "मुख्य फसलें",
    "profile.experience": "खेती का अनुभव",
    "profile.totalQueries": "कुल प्रश्न",
    "profile.dataDownloaded": "डाउनलोड किया गया डेटा",
    "profile.lastSync": "अंतिम सिंक",
    "profile.offlineData": "ऑफलाइन डेटा आकार",

    // Alerts
    "alerts.title": "अलर्ट और सूचनाएं",
    "alerts.active": "सक्रिय अलर्ट",
    "alerts.history": "अलर्ट इतिहास",
    "alerts.settings": "अलर्ट सेटिंग्स",
    "alerts.weather": "मौसम अलर्ट",
    "alerts.pest": "कीट अलर्ट",
    "alerts.market": "बाजार अलर्ट",
    "alerts.irrigation": "सिंचाई रिमाइंडर",
    "alerts.fertilizer": "उर्वरक रिमाइंडर",
    "alerts.harvest": "फसल रिमाइंडर",
    "alerts.markAsRead": "पढ़ा हुआ चिह्नित करें",
    "alerts.dismiss": "खारिज करें",
    "alerts.viewDetails": "विवरण देखें",

    // Quick Actions
    "quickActions.pestDetection": "कीट पहचान",
    "quickActions.pestDesc": "AI-संचालित कीट पहचान के लिए फसल की तस्वीरें अपलोड करें",
    "quickActions.soilHealth": "मिट्टी का स्वास्थ्य",
    "quickActions.soilDesc": "मिट्टी का विश्लेषण और सुधार की सिफारिशें प्राप्त करें",
    "quickActions.marketPrices": "बाजार भाव",
    "quickActions.marketDesc": "नजदीकी बाजारों में वर्तमान फसल की कीमतें जांचें",
    "quickActions.cropTimeline": "फसल समयरेखा",
    "quickActions.timelineDesc": "अपनी फसल की वृद्धि के चरणों और गतिविधियों को ट्रैक करें",
    "quickActions.weatherForecast": "मौसम पूर्वानुमान",
    "quickActions.weatherDesc": "खेती की सलाह के साथ 7-दिन का मौसम पूर्वानुमान",
    "quickActions.fertilizer": "उर्वरक गाइड",
    "quickActions.fertilizerDesc": "व्यक्तिगत उर्वरक सिफारिशें प्राप्त करें",

    autoTTSEnabled: "ऑटो टेक्स्ट-टू-स्पीच सक्षम",
    autoTTSDisabled: "ऑटो टेक्स्ट-टू-स्पीच अक्षम",
    selected: "चयनित",
    navigatingTo: "जा रहे हैं",
    pageLoaded: "पेज लोड हुआ",
    buttonPressed: "बटन दबाया गया",
    focusedOn: "फोकस किया गया",
    enableAutoTTS: "ऑटो टेक्स्ट-टू-स्पीच सक्षम करें",
    disableAutoTTS: "ऑटो टेक्स्ट-टू-स्पीच अक्षम करें",
    autoTTSOn: "ऑटो TTS चालू",
    autoTTSOff: "ऑटो TTS बंद",
    hoveredOver: "होवर किया गया",
    clicked: "क्लिक किया गया",
    formField: "फॉर्म फील्ड",
    menuItem: "मेनू आइटम",
    cardContent: "कार्ड सामग्री",
    linkText: "लिंक",
    imageDescription: "छवि",
  },

  bn: {
    // Navigation & Common
    "app.title": "স্মার্ট ফসল পরামর্শদাতা",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.cropAdvisory": "ফসল পরামর্শ",
    "nav.weather": "আবহাওয়া",
    "nav.pestDetection": "কীটপতঙ্গ সনাক্তকরণ",
    "nav.marketPrices": "বাজার দর",
    "nav.profile": "প্রোফাইল",
    "nav.settings": "সেটিংস",
    "nav.logout": "লগআউট",
    "common.loading": "লোড হচ্ছে...",
    "common.save": "সংরক্ষণ করুন",
    "common.cancel": "বাতিল করুন",
    "common.submit": "জমা দিন",
    "common.back": "পিছনে",
    "common.next": "পরবর্তী",
    "common.offline": "অফলাইন মোড",
    "common.online": "অনলাইন",

    // Home Page
    "home.title": "স্মার্ট ফসল পরামর্শদাতা সিস্টেম",
    "home.subtitle": "AI-চালিত কৃষি সমাধানের মাধ্যমে ছোট ও প্রান্তিক কৃষকদের ক্ষমতায়ন",
    "home.getStarted": "শুরু করো",
    "home.learnMore": "আরও জানুন",
    "home.features.weather": "আবহাওয়া পূর্বাভাস",
    "home.features.pest": "কীটপতঙ্গ সনাক্তকরণ",
    "home.features.market": "বাজার দর",
    "home.features.advisory": "ফসল পরামর্শ",
    "home.features.multilingual": "বহুভাষিক সহায়তা",
    "home.features.offline": "অফলাইন অ্যাক্সেস",
  },

  te: {
    // Navigation & Common
    "app.title": "స్మార్ట్ పంట సలహాదారు",
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.cropAdvisory": "పంట సలహా",
    "nav.weather": "వాతావరణం",
    "nav.pestDetection": "కీటకాల గుర్తింపు",
    "nav.marketPrices": "మార్కెట్ ధరలు",
    "nav.profile": "ప్రొఫైల్",
    "nav.settings": "సెట్టింగ్స్",
    "nav.logout": "లాగ్అవుట్",
    "common.loading": "లోడ్ అవుతోంది...",
    "common.save": "సేవ్ చేయండి",
    "common.cancel": "రద్దు చేయండి",
    "common.submit": "సమర్పించండి",
    "common.back": "వెనుకకు",
    "common.next": "తదుపరి",
    "common.offline": "ఆఫ్‌లైన్ మోడ్",
    "common.online": "ఆన్‌లైన్",

    // Home Page
    "home.title": "స్మార్ట్ పంట సలహాదారు వ్యవస్థ",
    "home.subtitle": "AI-ఆధారిత వ్యవసాయ పరిష్కారాలతో చిన్న మరియు సరిహద్దు రైతులను శక్తివంతం చేయడం",
    "home.getStarted": "ప్రారంభించండి",
    "home.learnMore": "మరింత తెలుసుకోండి",
    "home.features.weather": "వాతావరణ అంచనా",
    "home.features.pest": "కీటకాల గుర్తింపు",
    "home.features.market": "మార్కెట్ ధరలు",
    "home.features.advisory": "పంట సలహా",
    "home.features.multilingual": "బహుభాషా మద్దతు",
    "home.features.offline": "ఆఫ్‌లైన్ యాక్సెస్",
  },

  mr: {
    // Navigation & Common
    "app.title": "स्मार्ट पीक सल्लागार",
    "nav.dashboard": "डॅशबोर्ड",
    "nav.cropAdvisory": "पीक सल्ला",
    "nav.weather": "हवामान",
    "nav.pestDetection": "कीड ओळख",
    "nav.marketPrices": "बाजार भाव",
    "nav.profile": "प्रोफाइल",
    "nav.settings": "सेटिंग्ज",
    "nav.logout": "लॉगआउट",
    "common.loading": "लोड होत आहे...",
    "common.save": "सेव्ह करा",
    "common.cancel": "रद्द करा",
    "common.submit": "सबमिट करा",
    "common.back": "मागे",
    "common.next": "पुढे",
    "common.offline": "ऑफलाइन मोડ",
    "common.online": "ऑनलाइन",

    // Home Page
    "home.title": "स्मार्ट पीक सल्लागार प्रणाली",
    "home.subtitle": "AI-चालित कृषी समाधानांसह लहान आणि सीमांत शेतकऱ्यांना सक्षम करणे",
    "home.getStarted": "सुरुवात करा",
    "home.learnMore": "अधिक जाणून घ्या",
    "home.features.weather": "हवामान अंदाज",
    "home.features.pest": "कीड ओळख",
    "home.features.market": "बाजार भाव",
    "home.features.advisory": "पीक सल्ला",
    "home.features.multilingual": "बहुभाषिक समर्थन",
    "home.features.offline": "ऑफलाइन प्रवेश",
  },

  ta: {
    // Navigation & Common
    "app.title": "ஸ்மார்ட் பயிர் ஆலோசகர்",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.cropAdvisory": "பயிர் ஆலோசனை",
    "nav.weather": "வானிலை",
    "nav.pestDetection": "பூச்சி கண்டறிதல்",
    "nav.marketPrices": "சந்தை விலைகள்",
    "nav.profile": "சுயவிவரம்",
    "nav.settings": "அமைப்புகள்",
    "nav.logout": "வெளியேறு",
    "common.loading": "ஏற்றுகிறது...",
    "common.save": "சேமிக்கவும்",
    "common.cancel": "ரத்து செய்யவும்",
    "common.submit": "சமர்ப்பிக்கவும்",
    "common.back": "பின்னால்",
    "common.next": "அடுத்து",
    "common.offline": "ஆஃப்லைன் பயன்முறை",
    "common.online": "ஆன்லைன்",

    // Home Page
    "home.title": "ஸ்மார்ட் பயிர் ஆலோசகர் அமைப்பு",
    "home.subtitle": "AI-இயக்கப்படும் விவசாய தீர்வுகளுடன் சிறு மற்றும் குறு விவசாயிகளை வலுப்படுத்துதல்",
    "home.getStarted": "தொடங்குங்கள்",
    "home.learnMore": "மேலும் அறியவும்",
    "home.features.weather": "வானிலை முன்னறிவிப்பு",
    "home.features.pest": "பூச்சி கண்டறிதல்",
    "home.features.market": "சந்தை விலைகள்",
    "home.features.advisory": "பயிர் ஆலோசனை",
    "home.features.multilingual": "பல மொழி ஆதரவு",
    "home.features.offline": "ஆஃப்லைன் அணுகல்",
  },

  gu: {
    // Navigation & Common
    "app.title": "સ્માર્ટ પાક સલાહકાર",
    "nav.dashboard": "ડેશબોર્ડ",
    "nav.cropAdvisory": "પાક સલાહ",
    "nav.weather": "હવામાન",
    "nav.pestDetection": "જીવાત ઓળખ",
    "nav.marketPrices": "બજાર ભાવ",
    "nav.profile": "પ્રોફાઇલ",
    "nav.settings": "સેટિંગ્સ",
    "nav.logout": "લૉગઆઉટ",
    "common.loading": "લોડ થઈ રહ્યું છે...",
    "common.save": "સેવ કરો",
    "common.cancel": "રદ કરો",
    "common.submit": "સબમિટ કરો",
    "common.back": "પાછળ",
    "common.next": "આગળ",
    "common.offline": "ઑફલાઇન મોડ",
    "common.online": "ઑનલાઇન",

    // Home Page
    "home.title": "સ્માર્ટ પાક સલાહકાર સિસ્ટમ",
    "home.subtitle": "AI-સંચાલિત કૃષિ સમાધાનો સાથે નાના અને સીમાંત ખેડૂતોને સશક્ત બનાવવું",
    "home.getStarted": "શરૂ કરો",
    "home.learnMore": "વધુ જાણો",
    "home.features.weather": "હવામાન આગાહી",
    "home.features.pest": "જીવાત ઓળખ",
    "home.features.market": "બજાર ભાવ",
    "home.features.advisory": "પાક સલાહ",
    "home.features.multilingual": "બહુભાષી સપોર્ટ",
    "home.features.offline": "ઑફલાઇન એક્સેસ",
  },

  kn: {
    // Navigation & Common
    "app.title": "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹೆಗಾರ",
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.cropAdvisory": "ಬೆಳೆ ಸಲಹೆ",
    "nav.weather": "ಹವಾಮಾನ",
    "nav.pestDetection": "ಕೀಟ ಗುರುತಿಸುವಿಕೆ",
    "nav.marketPrices": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    "nav.profile": "ಪ್ರೊಫೈಲ್",
    "nav.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "nav.logout": "ಲಾಗ್‌ ಔಟ್",
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "common.save": "ಉಳಿಸಿ",
    "common.cancel": "ರದ್ದುಗೊಳಿಸಿ",
    "common.submit": "ಸಲ್ಲಿಸಿ",
    "common.back": "ಹಿಂದೆ",
    "common.next": "ಮುಂದೆ",
    "common.offline": "ಆಫ್‌ಲೈನ್ ಮೋಡ್",
    "common.online": "ಆನ್‌ಲೈನ್",

    // Home Page
    "home.title": "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹೆಗಾರ ವ್ಯವಸ್ಥೆ",
    "home.subtitle": "AI-ಚಾಲಿತ ಕೃಷಿ ಪರಿಹಾರಗಳೊಂದಿಗೆ ಸಣ್ಣ ಮತ್ತು ಅಂಚಿನ ರೈತರನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು",
    "home.getStarted": "ಪ್ರಾರಂಭಿಸಿ",
    "home.learnMore": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    "home.features.weather": "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    "home.features.pest": "ಕೀಟ ಗುರುತಿಸುವಿಕೆ",
    "home.features.market": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    "home.features.advisory": "ಬೆಳೆ ಸಲಹೆ",
    "home.features.multilingual": "ಬಹುಭಾಷಾ ಬೆಂಬಲ",
    "home.features.offline": "ಆಫ್‌ಲೈನ್ ಪ್ರವೇಶ",
  },

  or: {
    // Navigation & Common
    "app.title": "ସ୍ମାର୍ଟ ଫସଲ ପରାମର୍ଶଦାତା",
    "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ",
    "nav.cropAdvisory": "ଫସଲ ପରାମର୍ଶ",
    "nav.weather": "ପାଗ",
    "nav.pestDetection": "କୀଟ ଚିହ୍ନଟ",
    "nav.marketPrices": "ବଜାର ଦର",
    "nav.profile": "ପ୍ରୋଫାଇଲ",
    "nav.settings": "ସେଟିଂସ",
    "nav.logout": "ଲଗଆଉଟ",
    "common.loading": "ଲୋଡ ହେଉଛି...",
    "common.save": "ସେଭ କରନ୍ତୁ",
    "common.cancel": "ବାତିଲ କରନ୍ତୁ",
    "common.submit": "ଦାଖଲ କରନ୍ତୁ",
    "common.back": "ପଛକୁ",
    "common.next": "ପରବର୍ତ୍ତୀ",
    "common.offline": "ଅଫଲାଇନ ମୋଡ",
    "common.online": "ଅନଲାଇନ",

    // Home Page
    "home.title": "ସ୍ମାର୍ଟ ଫସଲ ପରାମର୍ଶଦାତା ସିଷ୍ଟମ",
    "home.subtitle": "AI-ଚାଳିତ କୃଷି ସମାଧାନ ସହିତ ଛୋଟ ଏବଂ ସୀମାନ୍ତ କୃଷକମାନଙ୍କୁ ସଶକ୍ତ କରିବା",
    "home.getStarted": "ଆରମ୍ଭ କରନ୍ତୁ",
    "home.learnMore": "ଅଧିକ ଜାଣନ୍ତୁ",
    "home.features.weather": "ପାଗ ପୂର୍ବାନୁମାନ",
    "home.features.pest": "କୀଟ ଚିହ୍ନଟ",
    "home.features.market": "ବଜାର ଦର",
    "home.features.advisory": "ଫସଲ ପରାମର୍ଶ",
    "home.features.multilingual": "ବହୁଭାଷୀ ସହାୟତା",
    "home.features.offline": "ଅଫଲାଇନ ପ୍ରବେଶ",
  },

  pa: {
    // Navigation & Common
    "app.title": "ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ",
    "nav.dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "nav.cropAdvisory": "ਫਸਲ ਸਲਾਹ",
    "nav.weather": "ਮੌਸਮ",
    "nav.pestDetection": "ਕੀੜੇ ਦੀ ਪਛਾਣ",
    "nav.marketPrices": "ਮਾਰਕੀਟ ਰੇਟ",
    "nav.profile": "ਪ੍ਰੋਫਾਈਲ",
    "nav.settings": "ਸੈਟਿੰਗਜ਼",
    "nav.logout": "ਲਾਗਆਉਟ",
    "common.loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "common.save": "ਸੇਵ ਕਰੋ",
    "common.cancel": "ਰੱਦ ਕਰੋ",
    "common.submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
    "common.back": "ਵਾਪਸ",
    "common.next": "ਅਗਲਾ",
    "common.offline": "ਆਫਲਾਈਨ ਮੋਡ",
    "common.online": "ਆਨਲਾਈਨ",

    // Home Page
    "home.title": "ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਸਿਸਟਮ",
    "home.subtitle": "AI-ਸੰਚਾਲਿਤ ਖੇਤੀਬਾੜੀ ਹੱਲਾਂ ਨਾਲ ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
    "home.getStarted": "ਸ਼ੁਰੂ ਕਰੋ",
    "home.learnMore": "ਹੋਰ ਜਾਣੋ",
    "home.features.weather": "ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ",
    "home.features.pest": "ਕੀੜੇ ਦੀ ਪਛਾਣ",
    "home.features.market": "ਮਾਰਕੀਟ ਰੇਟ",
    "home.features.advisory": "ਫਸਲ ਸਲਾਹ",
    "home.features.multilingual": "ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ",
    "home.features.offline": "ਆਫਲਾਈਨ ਪਹੁੰਚ",
  },

  ml: {
    // Navigation & Common
    "app.title": "സ്മാർട്ട് വിള ഉപദേശകൻ",
    "nav.dashboard": "ഡാഷ്‌ബോർഡ്",
    "nav.cropAdvisory": "വിള ഉപദേശം",
    "nav.weather": "കാലാവസ്ഥ",
    "nav.pestDetection": "കീട തിരിച്ചറിയൽ",
    "nav.marketPrices": "മാർക്കറ്റ് വില",
    "nav.profile": "പ്രൊഫൈൽ",
    "nav.settings": "സെറ്റിംഗ്സ്",
    "nav.logout": "ലോഗൗട്ട്",
    "common.loading": "ലോഡ് ചെയ്യുന്നു...",
    "common.save": "സേവ് ചെയ്യുക",
    "common.cancel": "റദ്ദാക്കുക",
    "common.submit": "സമർപ്പിക്കുക",
    "common.back": "തിരികെ",
    "common.next": "അടുത്തത്",
    "common.offline": "ഓഫ്‌ലൈൻ മോഡ്",
    "common.online": "ഓൺലൈൻ",

    // Home Page
    "home.title": "സ്മാർട്ട് വിള ഉപദേശക സിസ്റ്റം",
    "home.subtitle": "AI-നയിക്കുന്ന കാർഷിക പരിഹാരങ്ങളുമായി ചെറുകിട, അതിർത്തി കർഷകരെ ശാക്തീകരിക്കുന്നു",
    "home.getStarted": "ആരംഭിക്കുക",
    "home.learnMore": "കൂടുതൽ അറിയുക",
    "home.features.weather": "കാലാവസ്ഥ പ്രവചനം",
    "home.features.pest": "കീട തിരിച്ചറിയൽ",
    "home.features.market": "മാർക്കറ്റ് വില",
    "home.features.advisory": "വിള ഉപദേശം",
    "home.features.multilingual": "ബഹുഭാഷാ പിന്തുണ",
    "home.features.offline": "ഓഫ്‌ലൈൻ ആക്‌സസ്",
  },
}

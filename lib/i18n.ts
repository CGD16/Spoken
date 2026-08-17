import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import de from "@/locales/de.json";
import en from "@/locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: "de", // Standard-Fallback
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

// Guard gegen SSR-Fehler ("window is not defined")
if (typeof window !== "undefined") {
  AsyncStorage.getItem("@setting_language").then((saved) => {
    if (saved === "de" || saved === "en") {
      i18n.changeLanguage(saved);
    }
  });
}

export default i18n;
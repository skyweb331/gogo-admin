import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/i18n/messages/en.json";

/** English only; keys missing from en.json render as written. */
i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

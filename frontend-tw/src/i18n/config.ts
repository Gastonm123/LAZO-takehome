import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

const defaultLocale =
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "en" ? "en" : "es";

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: defaultLocale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

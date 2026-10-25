import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ka from '../locales/ka.json'
import en from '../locales/en.json'

export const LANGUAGES = ['ka', 'en']
const STORAGE_KEY = 'lang'

function savedLanguage() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.includes(value) ? value : 'ka'
  } catch {
    return 'ka'
  }
}

i18n.use(initReactI18next).init({
  resources: { ka: { translation: ka }, en: { translation: en } },
  lng: savedLanguage(),
  fallbackLng: 'ka',
  interpolation: { escapeValue: false },
})

function applyLanguage(lng) {
  document.documentElement.lang = lng
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    return
  }
}

applyLanguage(i18n.language)
i18n.on('languageChanged', applyLanguage)

export default i18n
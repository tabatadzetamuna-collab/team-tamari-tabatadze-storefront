import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../../i18n'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div className="lang-switch" role="group" aria-label={t('language.label')}>
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          lang={lng}
          className="lang-switch__button"
          aria-pressed={i18n.language === lng}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
          <span className="visually-hidden"> — {t(`language.${lng}`)}</span>
        </button>
      ))}
    </div>
  )
}
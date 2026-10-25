import i18n from '../../i18n'

const LOCALES = { ka: 'ka-GE', en: 'en-US' }

export function currentLocale() {
  return LOCALES[i18n.language] ?? 'ka-GE'
}

export function formatPrice(value, currency = 'GEL') {
  return new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat(currentLocale(), {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}
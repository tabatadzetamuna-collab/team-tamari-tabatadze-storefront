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

const KA_MONTHS = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
]

export function formatDate(value) {
  const date = new Date(value)
  if (i18n.language !== 'ka') {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(date)
  }
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${date.getDate()} ${KA_MONTHS[date.getMonth()]}, ${date.getFullYear()}, ${time}`
}
const formatter = new Intl.NumberFormat('ka-GE', {
  style: 'currency',
  currency: 'GEL',
  maximumFractionDigits: 0,
})

export function formatPrice(value) {
  return formatter.format(value)
}
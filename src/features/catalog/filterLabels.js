const FILTER_NAMES_EN = {
  brand: 'Brand',
  price: 'Price',
  storage: 'Storage',
  ram: 'RAM',
  color: 'Color',
  os: 'Operating system',
}

const OPTION_NAMES_EN = {
  black: 'Black',
  white: 'White',
  blue: 'Blue',
  green: 'Green',
  pink: 'Pink',
  gold: 'Gold',
  ios: 'iOS',
  android: 'Android',
}

const humanize = (value) => value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')

const isGeorgian = (text) => /[\u10A0-\u10FF]/.test(text)

export function localizeFilters(filters, lng) {
  if (lng !== 'en') return filters

  return filters.map((filter) => ({
    ...filter,
    label: FILTER_NAMES_EN[filter.key] ?? humanize(filter.key),
    options: filter.options?.map((option) => ({
      ...option,
      label: isGeorgian(option.label)
        ? (OPTION_NAMES_EN[option.value] ?? humanize(option.value))
        : option.label,
    })),
  }))
}
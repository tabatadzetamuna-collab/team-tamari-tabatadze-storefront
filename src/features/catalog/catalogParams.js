import { CATEGORY_SLUG, PAGE_SIZE } from '../../config'

export const SORT_OPTIONS = [
  { value: 'newest', label: 'ახალი' },
  { value: 'oldest', label: 'ძველი' },
  { value: 'price-asc', label: 'ფასი: ზრდადობით' },
  { value: 'price-desc', label: 'ფასი: კლებადობით' },
  { value: 'rating-desc', label: 'რეიტინგით' },
  { value: 'popular', label: 'პოპულარული' },
  { value: 'title-asc', label: 'სახელით (ა–ჰ)' },
]

export function toApiParams(searchParams) {
  const params = { category: CATEGORY_SLUG, limit: String(PAGE_SIZE) }
  for (const [key, value] of searchParams) {
    if (value) params[key] = value
  }
  return params
}

export function readList(searchParams, key) {
  const raw = searchParams.get(key)
  return raw ? raw.split(',') : []
}

export function withParam(searchParams, key, value) {
  const next = new URLSearchParams(searchParams)
  const isEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0)

  if (isEmpty) next.delete(key)
  else next.set(key, Array.isArray(value) ? value.join(',') : String(value))

  if (key !== 'page') next.delete('page')
  return next
}
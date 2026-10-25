import { CATEGORY_SLUG, PAGE_SIZE } from '../../config'

export const SORT_OPTIONS = [
  { value: 'newest' },
  { value: 'oldest' },
  { value: 'price-asc' },
  { value: 'price-desc' },
  { value: 'rating-desc' },
  { value: 'popular' },
  { value: 'title-asc' },
]

const BASE_KEYS = ['q', 'sort', 'page', 'minPrice', 'maxPrice']

export function toApiParams(searchParams, filterKeys = []) {
  const allowed = new Set([...BASE_KEYS, ...filterKeys])
  const params = { category: CATEGORY_SLUG, limit: String(PAGE_SIZE) }
  for (const [key, value] of searchParams) {
    if (value && allowed.has(key)) params[key] = value
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
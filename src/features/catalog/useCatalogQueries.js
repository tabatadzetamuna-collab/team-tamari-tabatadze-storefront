import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { catalogService } from '../../shared/services/catalogService'

export function useCategory(slug) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: ({ signal }) => catalogService.getCategory(slug, signal),
    staleTime: Infinity,
  })
}

export function useProducts(params, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => catalogService.getProducts(params, signal),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function productQuery(slug) {
  return {
    queryKey: ['product', slug],
    queryFn: ({ signal }) => catalogService.getProduct(slug, signal),
    staleTime: 5 * 60 * 1000,
  }
}

export function useProduct(slug) {
  return useQuery(productQuery(slug))
}
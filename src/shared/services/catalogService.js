import { http } from './httpClient'

export const catalogService = {
  getCategory: (slug, signal) =>
    http.get(`/categories/${slug}`, { withToken: false, signal }),

  getProducts: (params, signal) =>
    http.get(`/products?${new URLSearchParams(params)}`, { withToken: false, signal }),

  getProduct: (slug, signal) =>
    http.get(`/products/${slug}`, { withToken: false, signal }),
}
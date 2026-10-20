import { http } from './httpClient'

export const cartService = {
  get: () => http.get('/cart'),
  add: (productId, qty = 1) => http.post('/cart/items', { productId, qty }),
  update: (itemId, qty) => http.patch(`/cart/items/${itemId}`, { qty }),
  remove: (itemId) => http.delete(`/cart/items/${itemId}`),
}
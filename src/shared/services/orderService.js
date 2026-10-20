import { http } from './httpClient'

export const orderService = {
  getCheckout: () => http.get('/checkout'),
  create: (body) => http.post('/orders', body),
  confirm: (orderId, code) => http.post(`/orders/${orderId}/confirm`, { code }),
  resendCode: (orderId) => http.post(`/orders/${orderId}/resend-code`),
  get: (orderId) => http.get(`/orders/${orderId}`),
}
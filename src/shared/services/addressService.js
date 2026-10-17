import { http } from './httpClient'

export const addressService = {
  list: () => http.get('/addresses'),
  create: (body) => http.post('/addresses', body),
  update: (id, body) => http.patch(`/addresses/${id}`, body),
  remove: (id) => http.delete(`/addresses/${id}`),
}
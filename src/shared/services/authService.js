import { http } from './httpClient'

export const authService = {
  register: ({ name, email, password }) =>
    http.post('/auth/register', { name, email, password }, { withToken: false }),

  login: ({ email, password }) =>
    http.post('/auth/login', { email, password }, { withToken: false }),

  getCurrentUser: () => http.get('/auth/me'),

  logout: () => http.post('/auth/logout'),

  requestResetCode: (email) =>
    http.post('/auth/forgot-password', { email }, { withToken: false }),

  verifyResetCode: (email, code) =>
    http.post('/auth/verify-reset-code', { email, code }, { withToken: false }),

  setNewPassword: (resetToken, password) =>
    http.post('/auth/reset-password', { resetToken, password }, { withToken: false }),
}
import { readToken, clearToken } from './tokenStorage'

const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  throw new Error('VITE_API_URL არ არის მითითებული — დააკოპირე .env.example → .env')
}

export class HttpError extends Error {
  constructor(status, data) {
    super(data?.message || 'მოთხოვნა ვერ შესრულდა')
    this.status = status
    this.code = data?.code
    this.errors = data?.errors
  }
}

const expiredListeners = new Set()

export function onSessionExpired(listener) {
  expiredListeners.add(listener)
  return () => expiredListeners.delete(listener)
}

export async function sendRequest(path, { method = 'GET', body, withToken = true, signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = readToken()
  if (withToken && token) headers.Authorization = `Bearer ${token}`

    let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new HttpError(0, {
      message: 'სერვერთან კავშირი ვერ მოხერხდა. შეამოწმე ინტერნეტი.',
      code: 'NETWORK_ERROR',
    })
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    const error = new HttpError(response.status, data)

    if (response.status === 401 && ['TOKEN_EXPIRED', 'INVALID_TOKEN'].includes(error.code)) {
      clearToken()
      expiredListeners.forEach((listener) => listener())
    }

    throw error
  }

  return data
}

export const http = {
  get: (path, options) => sendRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => sendRequest(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => sendRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => sendRequest(path, { ...options, method: 'DELETE' }),
}
const STORAGE_KEY = 'accessToken'

export function readToken() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // 
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    // 
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 
  }
}
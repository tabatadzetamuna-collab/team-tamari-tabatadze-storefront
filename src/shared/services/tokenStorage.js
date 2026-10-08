const STORAGE_KEY = 'accessToken'

export function readToken() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // ზოგ ბრაუზერში localStorage შეიძლება მიუწვდომელი იყოს
  }
}

export function saveToken(token) {
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY)
}
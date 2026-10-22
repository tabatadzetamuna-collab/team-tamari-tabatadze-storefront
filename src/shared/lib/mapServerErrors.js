export function mapFieldErrors(error, setError, fieldNames) {
  if (error?.code !== 'VALIDATION_ERROR' || !error.errors) return false

  let mapped = false
  for (const [field, message] of Object.entries(error.errors)) {
    if (!fieldNames.includes(field)) continue
    setError(field, { type: 'server', message }, { shouldFocus: !mapped })
    mapped = true
  }
  return mapped
}

const MESSAGES = {
  TOO_MANY_ATTEMPTS: 'ცდების ლიმიტი ამოიწურა, სცადე მოგვიანებით.',
  INVALID_RESET_CODE: 'კოდი არასწორია ან ვადაგასულია.',
  RESET_TOKEN_USED: 'აღდგენის ბმული უკვე გამოყენებულია. მოითხოვე ახალი კოდი.',
}

export function describeError(error) {
  if (error?.code === 'NETWORK_ERROR') return error.message
  return MESSAGES[error?.code] ?? 'შეცდომა მოხდა. სცადე თავიდან.'
}
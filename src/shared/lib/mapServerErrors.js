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
export function describeError(error) {
  if (error?.code === 'NETWORK_ERROR') return error.message
  return 'შეცდომა მოხდა. სცადე თავიდან.'
}
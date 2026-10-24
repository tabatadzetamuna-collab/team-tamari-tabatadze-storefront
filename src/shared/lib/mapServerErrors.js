import i18n from '../../i18n'

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
  NETWORK_ERROR: 'errors.network',
  TOO_MANY_ATTEMPTS: 'errors.tooMany',
  INVALID_RESET_CODE: 'errors.invalidResetCode',
  RESET_TOKEN_USED: 'errors.resetTokenUsed',
}

export function describeError(error) {
  return i18n.t(MESSAGES[error?.code] ?? 'errors.generic')
}
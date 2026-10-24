import { Children, cloneElement, isValidElement } from 'react'
import { useTranslation } from 'react-i18next'
import './FormField.css'

export default function FormField({ id, label, hint, error, hideLabel = false, children }) {
  const { t } = useTranslation()

  const errorText = error?.startsWith('validation.') ? t(error) : error

  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  const control = Children.map(children, (child) =>
    isValidElement(child) ? cloneElement(child, { 'aria-describedby': describedBy }) : child
  )

  return (
    <div className="form-field">
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : 'form-field__label'}>
        {label}
      </label>

      {control}

      {hint && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {errorText}
        </p>
      )}
    </div>
  )
}
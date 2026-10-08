import { Children, cloneElement, isValidElement } from 'react'
import './FormField.css'

export default function FormField({ id, label, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  const child = Children.only(children)
  const control = isValidElement(child)
    ? cloneElement(child, { 'aria-describedby': describedBy })
    : child

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
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
          {error}
        </p>
      )}
    </div>
  )
}
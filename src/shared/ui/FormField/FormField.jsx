import { Children, cloneElement, isValidElement } from 'react'
import './FormField.css'

// label + ველი + მინიშნება + შეცდომა ერთ ბლოკში.
// FormField თავად აბამს ველს aria-describedby-ს, რომ ეკრანის წამკითხველმა
// მინიშნებაც და შეცდომაც წაიკითხოს — გვერდებს ამაზე ფიქრი აღარ სჭირდებათ.
export default function FormField({ id, label, hint, error, hideLabel = false, children }) {  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  // ყველა შიდა ელემენტს (Input / PasswordInput) aria-describedby ემატება
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
          {error}
        </p>
      )}
    </div>
  )
}
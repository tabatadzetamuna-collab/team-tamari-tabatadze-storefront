import './FormField.css'

export default function FormField({ id, label, hint, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>

      {children}

      {error ? (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="form-field__hint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
import './Input.css'

export default function Input({ error = false, className = '', icon, ref, ...rest }) {
  const field = (
    <input
      ref={ref}
      className={`input ${icon ? 'input--with-icon' : ''} ${error ? 'input--error' : ''} ${className}`}
      aria-invalid={error}
      {...rest}
    />
  )

  if (!icon) return field

  return (
    <span className="input-wrap">
      <span className="input-wrap__icon">{icon}</span>
      {field}
    </span>
  )
}
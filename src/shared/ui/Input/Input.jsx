import './Input.css'

export default function Input({ error = false, className = '', ref, ...rest }) {
  return (
    <input
      ref={ref}
      className={`input ${error ? 'input--error' : ''} ${className}`}
      aria-invalid={error}
      {...rest}
    />
  )
}
import './Button.css'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${loading ? 'button--loading' : ''}`}
      // ლოდინისას გათიშულია, რომ კიდევ არ გაიგზავნოს, პროცესი მიმდინარეობს
      disabled={disabled || loading}
      aria-busy={loading} 
      {...rest}
    >
      <span className="button__text">{children}</span>
      {loading && <span className="button__spinner" aria-hidden="true" />}
    </button>
  )
}
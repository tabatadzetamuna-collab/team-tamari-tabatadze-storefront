import { forwardRef } from 'react'
import './Input.css'

const Input = forwardRef(function Input({ error = false, className = '', ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`input ${error ? 'input--error' : ''} ${className}`}
      aria-invalid={error}
      {...rest}
    />
  )
})

export default Input
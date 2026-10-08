import { useState } from 'react'
import Input from '../Input/Input'
import './PasswordInput.css'

export default function PasswordInput({ ref, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-input">
      <Input ref={ref} type={visible ? 'text' : 'password'} {...props} />

      <button
        type="button" 
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'პაროლის დამალვა' : 'პაროლის ჩვენება'}
        aria-pressed={visible}
      >
        {visible ? 'დამალვა' : 'ჩვენება'}
      </button>
    </div>
  )
}
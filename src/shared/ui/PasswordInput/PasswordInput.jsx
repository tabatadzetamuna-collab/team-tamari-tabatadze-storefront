import { useState } from 'react'
import Input from '../Input/Input'
import { EyeIcon, EyeOffIcon } from '../icons/icons'
import { useTranslation } from 'react-i18next'
import './PasswordInput.css'

export default function PasswordInput({ ref, ...props }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-input">
      <Input ref={ref} type={visible ? 'text' : 'password'} {...props} />

      <button
        type="button" 
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        aria-pressed={visible}
      >
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  )
}
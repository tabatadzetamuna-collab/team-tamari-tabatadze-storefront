import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import Alert from '../../shared/ui/Alert/Alert'
import RequestCodeStep from './RequestCodeStep'
import VerifyCodeStep from './VerifyCodeStep'
import SetPasswordStep from './SetPasswordStep'
import './ForgotPasswordPage.css'

const STEP_NUMBER = { request: 1, verify: 2, password: 3 }

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState('request') 
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState(null)

  function startOver() {
    setResetToken(null)
    setStep('request')
  }

  return (
    <AuthLayout title={t('auth.forgot.title')}>
      {STEP_NUMBER[step] && (
        <p className="forgot-page__step">{t('auth.forgot.step', { step: STEP_NUMBER[step] })}</p>
      )}

      {step === 'request' && (
        <RequestCodeStep
          onCodeSent={(sentEmail) => {
            setEmail(sentEmail)
            setStep('verify')
          }}
        />
      )}

      {step === 'verify' && (
        <VerifyCodeStep
          email={email}
          onVerified={(token) => {
            setResetToken(token)
            setStep('password')
          }}
          onStartOver={startOver}
        />
      )}

      {step === 'password' && (
        <SetPasswordStep
          resetToken={resetToken}
          onPasswordChanged={() => {
            setResetToken(null)
            setStep('done')
          }}
          onStartOver={startOver}
        />
      )}

      {step === 'done' && (
        <>
          <Alert variant="success">{t('auth.forgot.success')}</Alert>
          <Link to="/login" className="forgot-page__login-link">
            {t('auth.forgot.loginWithNew')}
          </Link>
        </>
      )}

      {(step === 'verify' || step === 'password') && (
        <p className="forgot-form__footer">
          <Link to="/login">{t('auth.forgot.backToLogin')}</Link>
        </p>
      )}
    </AuthLayout>
  )
}
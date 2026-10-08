import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import Alert from '../../shared/ui/Alert/Alert'
import RequestCodeStep from './RequestCodeStep'
import VerifyCodeStep from './VerifyCodeStep'
import SetPasswordStep from './SetPasswordStep'
import './ForgotPasswordPage.css'

const STEP_NUMBER = { request: 1, verify: 2, password: 3 }

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('request') // 'request' | 'verify' | 'password' | 'done'
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState(null)

  function startOver() {
    setResetToken(null)
    setStep('request')
  }

  return (
    <AuthLayout title="პაროლის აღდგენა">
      {STEP_NUMBER[step] && (
        <p className="forgot-page__step">ნაბიჯი {STEP_NUMBER[step]} / 3</p>
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
          <Alert variant="success">პაროლი წარმატებით შეიცვალა.</Alert>
          <Link to="/login" className="forgot-page__login-link">
            შესვლა ახალი პაროლით
          </Link>
        </>
      )}

      {step !== 'done' && (
        <p className="forgot-page__footer">
          <Link to="/login">დაბრუნება შესვლაზე</Link>
        </p>
      )}
    </AuthLayout>
  )
}
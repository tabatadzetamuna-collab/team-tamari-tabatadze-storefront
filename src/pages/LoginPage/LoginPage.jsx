import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { MailIcon, LockIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { loginSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import { useTranslation } from 'react-i18next'
import './LoginPage.css'

export default function LoginPage() {
  const { t } = useTranslation()
  const { signIn, expiredNotice } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values) {
    setFormError(null)
    try {
      await signIn(values)
      const from = location.state?.from
      navigate(from ? `${from.pathname}${from.search}` : '/', { replace: true })
    } catch (error) {
      if (error.code === 'INVALID_CREDENTIALS') {
        setFormError(t('auth.login.invalidCredentials'))
        return
      }
      if (mapFieldErrors(error, setError, ['email', 'password'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <AuthLayout title={t('auth.login.title')}>
      {expiredNotice && !formError && (
        <Alert variant="info">{t('auth.login.sessionExpired')}</Alert>
      )}
      {formError && <Alert variant="error">{formError}</Alert>}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="login-form__fieldset" disabled={isSubmitting}>
          <FormField id="email" label={t('auth.email')} hideLabel error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('auth.emailPlaceholder')}
              icon={<MailIcon />}
              error={!!errors.email}
              {...register('email')}
            />
          </FormField>

          <FormField id="password" label={t('auth.password')} hideLabel error={errors.password?.message}>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder={t('auth.passwordPlaceholder')}
              icon={<LockIcon />}
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>

          <Link to="/forgot-password" className="login-form__forgot">
            {t('auth.login.forgot')}
          </Link>

          <Button type="submit" loading={isSubmitting}>
           {t('auth.login.submit')} <ArrowRightIcon />
          </Button>
        </fieldset>
      </form>

      <p className="login-form__footer">
        {t('auth.login.noAccount')} <Link to="/register">{t('auth.login.createAccount')}</Link>
      </p>
    </AuthLayout>
  )
}
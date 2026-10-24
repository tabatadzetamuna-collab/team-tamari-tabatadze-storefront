import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { UserIcon, MailIcon, LockIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { registerSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import { useTranslation } from 'react-i18next'
import './RegisterPage.css'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { signUp } = useSession()
  const navigate = useNavigate()
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values) {
    setFormError(null)
    try {
      await signUp(values)
      navigate('/', { replace: true })
    } catch (error) {
      if (error.code === 'EMAIL_TAKEN') {
        setError(
          'email',
          { type: 'server', message: 'validation.emailTaken' },
          { shouldFocus: true }
        )
        return
      }
      if (mapFieldErrors(error, setError, ['name', 'email', 'password'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <AuthLayout title={t('auth.register.title')}>
      {formError && <Alert variant="error">{formError}</Alert>}

      <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="register-form__fieldset" disabled={isSubmitting}>
          <FormField id="name" label={t('auth.name')} hideLabel error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder={t('auth.namePlaceholder')}
              icon={<UserIcon />}
              error={!!errors.name}
              {...register('name')}
            />
          </FormField>

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

          <FormField
            id="password"
            label={t('auth.password')}
            hideLabel
            hint={t('auth.passwordHint')}
            error={errors.password?.message}
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder={t('auth.passwordPlaceholder')}
              icon={<LockIcon />}
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>

          <FormField
            id="confirmPassword"
            label={t('auth.repeatPassword')}
            hideLabel
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder={t('auth.repeatPassword')}
              icon={<LockIcon />}
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
          </FormField>

          <Button type="submit" loading={isSubmitting}>
            {t('auth.register.submit')} <ArrowRightIcon />
          </Button>
        </fieldset>
      </form>

      <p className="register-form__footer">
        {t('auth.register.haveAccount')} <Link to="/login">{t('auth.register.login')}</Link>
      </p>
    </AuthLayout>
  )
}
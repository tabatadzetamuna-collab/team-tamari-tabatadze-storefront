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
import { loginSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import './LoginPage.css'

export default function LoginPage() {
  const { signIn, expiredNotice } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState(null) // ბანერი ფორმის თავში

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
        setFormError('არასწორი ელფოსტა ან პაროლი')
        return
      }
      if (mapFieldErrors(error, setError, ['email', 'password'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <AuthLayout title="შესვლა">
      {expiredNotice && !formError && (
        <Alert variant="info">სესიას ვადა გაუვიდა. გთხოვ, თავიდან შედი.</Alert>
      )}
      {formError && <Alert variant="error">{formError}</Alert>}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="login-form__fieldset" disabled={isSubmitting}>
          <FormField id="email" label="ელფოსტა" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              {...register('email')}
            />
          </FormField>

          <FormField id="password" label="პაროლი" error={errors.password?.message}>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>

          <Link to="/forgot-password" className="login-form__forgot">
            დაგავიწყდა პაროლი?
          </Link>

          <Button type="submit" loading={isSubmitting}>
            შესვლა
          </Button>
        </fieldset>
      </form>

      <p className="login-form__footer">
        არ გაქვს ანგარიში? <Link to="/register">შექმენი ანგარიში</Link>
      </p>
    </AuthLayout>
  )
}
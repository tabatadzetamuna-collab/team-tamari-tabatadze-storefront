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
import './RegisterPage.css'

export default function RegisterPage() {
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
          { type: 'server', message: 'ეს ელფოსტა უკვე რეგისტრირებულია' },
          { shouldFocus: true }
        )
        return
      }
      if (mapFieldErrors(error, setError, ['name', 'email', 'password'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <AuthLayout title="რეგისტრაცია">
      {formError && <Alert variant="error">{formError}</Alert>}

      <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="register-form__fieldset" disabled={isSubmitting}>
          <FormField id="name" label="სახელი" hideLabel error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="შეიყვანე სახელი"
              icon={<UserIcon />}
              error={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField id="email" label="ელფოსტა" hideLabel error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="შეიყვანე ელფოსტა"
              icon={<MailIcon />}
              error={!!errors.email}
              {...register('email')}
            />
          </FormField>

          <FormField
            id="password"
            label="პაროლი"
            hideLabel
            hint="პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, მათ შორის 1 ასოს და 1 ციფრს"
            error={errors.password?.message}
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="შეიყვანე პაროლი"
              icon={<LockIcon />}
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>

          <FormField
            id="confirmPassword"
            label="გაიმეორე პაროლი"
            hideLabel
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="გაიმეორე პაროლი"
              icon={<LockIcon />}
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
          </FormField>

          <Button type="submit" loading={isSubmitting}>
            ანგარიშის შექმნა <ArrowRightIcon />
          </Button>
        </fieldset>
      </form>

      <p className="register-form__footer">
        უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </AuthLayout>
  )
}
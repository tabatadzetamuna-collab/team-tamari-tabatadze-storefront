import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import { MailIcon, LockIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { loginSchema } from '../../shared/lib/validation'
import './LoginPage.css'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values) {
    await wait(800)
    console.log(values)
  }

  return (
    <AuthLayout title="არსებული მომხმარებელი">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <FormField id="password" label="პაროლი" hideLabel error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="შეიყვანე პაროლი"
            icon={<LockIcon />}
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <Link to="/forgot-password" className="login-form__forgot">
          დაგავიწყდა პაროლი?
        </Link>

        <Button type="submit" loading={isSubmitting}>
          შესვლა <ArrowRightIcon />
        </Button>
      </form>

      <p className="login-form__footer">
        არ გაქვს ანგარიში? <Link to="/register">შექმენი ანგარიში</Link>
      </p>
    </AuthLayout>
  )
}

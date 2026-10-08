import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import { registerSchema } from '../../shared/lib/validation'
import './RegisterPage.css'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values) {
    await wait(800)
    console.log(values)
  }

  return (
    <AuthLayout title="რეგისტრაცია">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField id="name" label="სახელი" error={errors.name?.message}>
          <Input id="name" autoComplete="name" error={!!errors.name} {...register('name')} />
        </FormField>

        <FormField id="email" label="ელფოსტა" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField
          id="password"
          label="პაროლი"
          hint="პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, მათ შორის 1 ასოს და 1 ციფრს"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="გაიმეორე პაროლი"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" loading={isSubmitting}>
          რეგისტრაცია
        </Button>
      </form>

      <p className="register-form__footer">
        უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </AuthLayout>
  )
}
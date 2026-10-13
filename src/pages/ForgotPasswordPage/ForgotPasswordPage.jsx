import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { MailIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { forgotSchema } from '../../shared/lib/validation'
import './ForgotPasswordPage.css'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  })

  async function onSubmit(values) {
    await wait(800)
    console.log(values)
    setSent(true)
  }

  return (
    <AuthLayout title="პაროლის აღდგენა">
      {sent && (
        <Alert variant="success">
        </Alert>
      )}

      <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <div className="forgot-form__actions">
          <Link
            to="/login"
            className="button button--secondary"
            aria-label="დაბრუნება შესვლაზე"
          >
            დაბრუნება
          </Link>

          <Button type="submit" loading={isSubmitting}>
            ბმულის გაგზავნა <ArrowRightIcon />
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
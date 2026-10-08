import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { authService } from '../../shared/services/authService'
import { forgotSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'

export default function RequestCodeStep({ onCodeSent }) {
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  })

  async function onSubmit({ email }) {
    setFormError(null)
    try {
      await authService.requestResetCode(email)
      onCodeSent(email)
    } catch (error) {
      if (mapFieldErrors(error, setError, ['email'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset className="forgot-form__fieldset" disabled={isSubmitting}>
        <FormField id="email" label="ელფოსტა" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <Button type="submit" loading={isSubmitting}>
          კოდის მიღება
        </Button>
      </fieldset>
    </form>
  )
}
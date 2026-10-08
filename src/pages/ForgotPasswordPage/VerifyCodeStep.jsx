import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { authService } from '../../shared/services/authService'
import { codeSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'

export default function VerifyCodeStep({ email, onVerified, onStartOver }) {
  const [formError, setFormError] = useState(null)
  const [tooManyAttempts, setTooManyAttempts] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(codeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  })

  async function onSubmit({ code }) {
    setFormError(null)
    try {
      const { resetToken } = await authService.verifyResetCode(email, code)
      onVerified(resetToken)
    } catch (error) {
      if (error.code === 'INVALID_RESET_CODE') {
        setError(
          'code',
          { type: 'server', message: 'კოდი არასწორია ან ვადაგასულია' },
          { shouldFocus: true }
        )
        return
      }
      if (error.code === 'TOO_MANY_ATTEMPTS') {
        setTooManyAttempts(true)
        return
      }
      if (mapFieldErrors(error, setError, ['code'])) return
      setFormError(describeError(error))
    }
  }

  if (tooManyAttempts) {
    return (
      <>
        <Alert variant="error">ძალიან ბევრი არასწორი მცდელობა. მოითხოვე ახალი კოდი.</Alert>
        <Button onClick={onStartOver}>ახალი კოდის მოთხოვნა</Button>
      </>
    )
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Alert variant="info">
        თუ {email}-ზე ანგარიში არსებობს, გამოგიგზავნეთ 6-ციფრიანი კოდი.
      </Alert>
      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset className="forgot-form__fieldset" disabled={isSubmitting}>
        <FormField id="code" label="კოდი" error={errors.code?.message}>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            error={!!errors.code}
            {...register('code')}
          />
        </FormField>

        <Button type="submit" loading={isSubmitting}>
          დადასტურება
        </Button>
      </fieldset>
    </form>
  )
}
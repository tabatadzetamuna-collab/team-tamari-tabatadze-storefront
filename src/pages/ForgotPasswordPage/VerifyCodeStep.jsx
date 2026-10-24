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
import { KeyIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { Trans, useTranslation } from 'react-i18next'

export default function VerifyCodeStep({ email, onVerified, onStartOver }) {
  const { t } = useTranslation()
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
          { type: 'server', message: 'validation.codeInvalid' },
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
        <Alert variant="error">{t('confirm.tooMany')}</Alert>
        <Button onClick={onStartOver}>{t('confirm.requestNew')}</Button>
      </>
    )
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="forgot-form__note">
        <Trans i18nKey="auth.forgot.codeSent" values={{ email }} components={{ strong: <strong /> }} />
      </p>
      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset className="forgot-form__fieldset" disabled={isSubmitting}>
        <FormField id="code" label={t('auth.forgot.code')} hideLabel error={errors.code?.message}>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder={t('auth.forgot.codePlaceholder')}
            icon={<KeyIcon />}
            error={!!errors.code}
            {...register('code')}
          />
        </FormField>

        <Button type="submit" loading={isSubmitting}>
{t      ('confirm.submit')} <ArrowRightIcon />
        </Button>
      </fieldset>
    </form>
  )
}
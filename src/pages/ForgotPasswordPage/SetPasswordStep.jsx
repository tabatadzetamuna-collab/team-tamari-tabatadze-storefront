import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../shared/ui/FormField/FormField'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { LockIcon, ArrowRightIcon } from '../../shared/ui/icons/icons'
import { authService } from '../../shared/services/authService'
import { newPasswordSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import { useTranslation } from 'react-i18next'

export default function SetPasswordStep({ resetToken, onPasswordChanged, onStartOver }) {
  const { t } = useTranslation()
  const [formError, setFormError] = useState(null)
  const [tokenInvalid, setTokenInvalid] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit({ password }) {
    setFormError(null)
    try {
      await authService.setNewPassword(resetToken, password)
      onPasswordChanged()
    } catch (error) {
      if (error.status === 400) {
        setTokenInvalid(true)
        return
      }
      if (mapFieldErrors(error, setError, ['password'])) return
      setFormError(describeError(error))
    }
  }

  if (tokenInvalid) {
    return (
      <>
        <Alert variant="error">{t('auth.forgot.expired')}</Alert>
        <Button onClick={onStartOver}>{t('confirm.requestNew')}</Button>
      </>
    )
  }

  return (
    <form className="forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset className="forgot-form__fieldset" disabled={isSubmitting}>
        <FormField
          id="password"
          label={t('auth.forgot.newPassword')}
          hideLabel
          hint={t('auth.passwordHint')}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder={t('auth.forgot.newPassword')}
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
         {t('auth.forgot.changePassword')} <ArrowRightIcon />
        </Button>
      </fieldset>
    </form>
  )
}
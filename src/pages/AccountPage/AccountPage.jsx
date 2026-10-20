import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '../../session/useSession'
import { authService } from '../../shared/services/authService'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import PasswordInput from '../../shared/ui/PasswordInput/PasswordInput'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { EditIcon } from '../../shared/ui/icons/icons'
import { profileSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import './AccountPage.css'

const NOT_CHANGES = ['currentPassword', 'confirmNewPassword']

export default function AccountPage() {
  const { user, updateUser } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState(null)
  const [saved, setSaved] = useState(false)

  const emptyValues = (u) => ({
    name: u.name,
    email: u.email,
    newPassword: '',
    confirmNewPassword: '',
    currentPassword: '',
  })

  const {
    register,
    handleSubmit,
    setError,
    reset,
    resetField,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyValues(user),
  })

  const changedKeys = Object.keys(dirtyFields).filter((key) => !NOT_CHANGES.includes(key))
  const canSave = changedKeys.length > 0

  function togglePassword() {
    if (showPassword) {
      resetField('newPassword')
      resetField('confirmNewPassword')
    }
    setShowPassword((open) => !open)
  }

  async function onSubmit(values) {
    setFormError(null)
    setSaved(false)

    const changed = Object.fromEntries(changedKeys.map((key) => [key, values[key]]))

    try {
      const data = await authService.updateProfile({
        currentPassword: values.currentPassword,
        ...changed,
      })
      updateUser(data.user)          
      reset(emptyValues(data.user))  
      setShowPassword(false)
      setSaved(true)
    } catch (error) {
      if (error.code === 'INVALID_CURRENT_PASSWORD') {
        setError('currentPassword', { type: 'server', message: 'პაროლი არასწორია' }, { shouldFocus: true })
        return
      }
      if (error.code === 'EMAIL_TAKEN') {
        setError(
          'email',
          { type: 'server', message: 'ეს ელფოსტა უკვე რეგისტრირებულია' },
          { shouldFocus: true }
        )
        return
      }
      if (error.code === 'VALIDATION_ERROR' && error.errors?._) {
        setFormError('შესაცვლელი არაფერია')
        return
      }
      if (mapFieldErrors(error, setError, ['name', 'email', 'newPassword', 'currentPassword'])) return
      setFormError(describeError(error))
    }
  }

  return (
    <section className="account-card">
      <h1 className="account-card__header">ანგარიშის პარამეტრები</h1>

      <div className="account-card__body">
        <span className="account-card__avatar" aria-hidden="true">
          {user.name?.charAt(0).toUpperCase()}
        </span>

        <form className="account-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {saved && <Alert variant="success">ცვლილებები შენახულია</Alert>}
          {formError && <Alert variant="error">{formError}</Alert>}

          <fieldset className="account-form__fieldset" disabled={isSubmitting}>
            <div className="account-form__grid">
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
            </div>

            <button
              type="button"
              className="account-form__toggle"
              aria-expanded={showPassword}
              aria-controls="new-password-fields"
              onClick={togglePassword}
            >
              პაროლის შეცვლა <EditIcon />
            </button>

            {showPassword && (
              <div id="new-password-fields" className="account-form__grid">
                <FormField
                  id="newPassword"
                  label="ახალი პაროლი"
                  hint="მინიმუმ 8 სიმბოლო, მათ შორის 1 ასო და 1 ციფრი"
                  error={errors.newPassword?.message}
                >
                  <PasswordInput
                    id="newPassword"
                    autoComplete="new-password"
                    error={!!errors.newPassword}
                    {...register('newPassword')}
                  />
                </FormField>

                <FormField
                  id="confirmNewPassword"
                  label="გაიმეორე ახალი პაროლი"
                  error={errors.confirmNewPassword?.message}
                >
                  <PasswordInput
                    id="confirmNewPassword"
                    autoComplete="new-password"
                    error={!!errors.confirmNewPassword}
                    {...register('confirmNewPassword')}
                  />
                </FormField>
              </div>
            )}

            <FormField
              id="currentPassword"
              label="მიმდინარე პაროლი"
              error={errors.currentPassword?.message}
            >
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                error={!!errors.currentPassword}
                {...register('currentPassword')}
              />
            </FormField>

            <div className="account-form__actions">
              <Button type="submit" loading={isSubmitting} disabled={!canSave}>
                შენახვა
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  )
}
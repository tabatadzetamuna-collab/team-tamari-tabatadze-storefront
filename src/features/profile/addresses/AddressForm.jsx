import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../../shared/ui/FormField/FormField'
import Input from '../../../shared/ui/Input/Input'
import Button from '../../../shared/ui/Button/Button'
import Alert from '../../../shared/ui/Alert/Alert'
import { addressSchema } from '../../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../../shared/lib/mapServerErrors'
import './addresses.css'

const FIELDS = ['label', 'fullName', 'phone', 'city', 'address']

export default function AddressForm({ address, onSave, onCancel }) {
  const isEdit = Boolean(address)
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, dirtyFields, isDirty },
  } = useForm({
    resolver: zodResolver(addressSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      label: address?.label ?? '',
      fullName: address?.fullName ?? '',
      phone: address?.phone ?? '',
      city: address?.city ?? '',
      address: address?.address ?? '',
      isDefault: false,
    },
  })

  async function onSubmit(values) {
    setFormError(null)

    const body = isEdit
      ? Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, values[key]]))
      : values

    try {
      await onSave(body)
    } catch (error) {
      if (error.code === 'ADDRESS_LIMIT_REACHED') {
        setFormError('მაქსიმუმ 10 მისამართის შენახვა შეიძლება')
        return
      }
      if (mapFieldErrors(error, setError, FIELDS)) return
      setFormError(describeError(error))
    }
  }

  const prefix = isEdit ? `edit-${address.id}` : 'new'

  return (
    <form className="address-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="address-form__title">
        {isEdit ? 'მისამართის რედაქტირება' : 'ახალი მისამართი'}
      </h2>

      {formError && <Alert variant="error">{formError}</Alert>}

      <fieldset className="address-form__fieldset" disabled={isSubmitting}>
        <div className="address-form__grid">
          <FormField
            id={`${prefix}-label`}
            label="დასახელება (არასავალდებულო)"
            error={errors.label?.message}
          >
            <Input id={`${prefix}-label`} error={!!errors.label} {...register('label')} />
          </FormField>

          <FormField id={`${prefix}-fullName`} label="მიმღები" error={errors.fullName?.message}>
            <Input
              id={`${prefix}-fullName`}
              autoComplete="name"
              error={!!errors.fullName}
              {...register('fullName')}
            />
          </FormField>

          <FormField id={`${prefix}-phone`} label="ტელეფონი" error={errors.phone?.message}>
            <Input
              id={`${prefix}-phone`}
              type="tel"
              autoComplete="tel"
              placeholder="+995 555 12 34 56"
              error={!!errors.phone}
              {...register('phone')}
            />
          </FormField>

          <FormField id={`${prefix}-city`} label="ქალაქი" error={errors.city?.message}>
            <Input
              id={`${prefix}-city`}
              autoComplete="address-level2"
              error={!!errors.city}
              {...register('city')}
            />
          </FormField>
        </div>

        <FormField id={`${prefix}-address`} label="მისამართი" error={errors.address?.message}>
          <Input
            id={`${prefix}-address`}
            autoComplete="street-address"
            error={!!errors.address}
            {...register('address')}
          />
        </FormField>

        {!address?.isDefault && (
          <label className="address-form__check">
            <input type="checkbox" {...register('isDefault')} />
            ძირითადად დაყენება
          </label>
        )}

        <div className="address-form__actions">
          <Button type="submit" loading={isSubmitting} disabled={isEdit && !isDirty}>
            შენახვა
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            გაუქმება
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckout } from '../../features/checkout/useCheckout'
import { orderService } from '../../shared/services/orderService'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { checkoutSchema } from '../../shared/lib/validation'
import { mapFieldErrors, describeError } from '../../shared/lib/mapServerErrors'
import { formatCardNumber, formatExpiry } from '../../shared/lib/card'
import { formatPrice } from '../../shared/lib/formatPrice'
import { useTranslation } from 'react-i18next'
import './CheckoutPage.css'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

const SERVER_FIELDS = [
  'shipping.fullName', 'shipping.phone', 'shipping.city', 'shipping.address',
  'card.number', 'card.holder', 'card.expiry', 'card.cvc',
]

export default function CheckoutPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('checkout.title'))
  const { data, isPending, isError, refetch } = useCheckout()

  if (isPending) {
    return (
      <section className="checkout-page" aria-busy="true">
        <div className="skeleton checkout-page__skeleton" />
      </section>
    )
  }

  if (isError) {
    return <EmptyState role="alert" title={t('common.loadFailed')} actionLabel={t('common.retry')} onAction={() => refetch()} />
  }

  if (data.items.length === 0) return <Navigate to="/cart" replace />

  return <CheckoutForm checkout={data} />
}

function CheckoutForm({ checkout }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formError, setFormError] = useState(null)
  const [cardError, setCardError] = useState(null)
  const [stockError, setStockError] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(
    checkout.addresses.find((a) => a.isDefault)?.id ?? null
  )

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      shipping: {
        fullName: checkout.shipping?.fullName ?? '',
        phone: checkout.shipping?.phone ?? '',
        city: checkout.shipping?.city ?? '',
        address: checkout.shipping?.address ?? '',
      },
      card: { number: '', holder: '', expiry: '', cvc: '' },
    },
  })

  function chooseAddress(address) {
    setSelectedAddress(address.id)
    const options = { shouldValidate: true, shouldDirty: true }
    setValue('shipping.fullName', address.fullName, options)
    setValue('shipping.phone', address.phone, options)
    setValue('shipping.city', address.city, options)
    setValue('shipping.address', address.address, options)
  }

  async function onSubmit(values) {
    setFormError(null)
    setCardError(null)
    setStockError(false)
    try {
      const { orderId } = await orderService.create(values)
      navigate(`/checkout/confirm/${orderId}`)
    } catch (error) {
      if (error.code === 'CARD_DECLINED') {
        setCardError(t('checkout.cardDeclined'))
        return
      }
      if (error.code === 'CART_EMPTY') {
        navigate('/cart', { replace: true })
        return
      }
      if (error.code === 'INSUFFICIENT_STOCK') {
        setStockError(true)
        return
      }
      if (mapFieldErrors(error, setError, SERVER_FIELDS)) return
      setFormError(describeError(error))
    }
  }

  const { items, subtotal, shippingFee, total, freeShippingFrom, addresses } = checkout
  const untilFree = freeShippingFrom - subtotal

  return (
    <section className="checkout-page">
      <nav className="checkout-page__breadcrumb" aria-label={t('product.breadcrumb')}>
        <Link to="/">{t('product.home')}</Link> / <Link to="/cart">{t('cart.title')}</Link> / <span>{t('checkout.title')}</span>
      </nav>

      <h1 className="checkout-page__title">{t('checkout.title')}</h1>

      <form className="checkout-page__layout" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="checkout-page__main" disabled={isSubmitting}>
          {formError && <Alert variant="error">{formError}</Alert>}
          {stockError && (
            <Alert variant="error">
              {t('checkout.stockError')} <Link to="/cart">{t('checkout.backToCart')}</Link>            </Alert>
          )}

          <section className="checkout-card" aria-labelledby="shipping-title">
            <h2 id="shipping-title" className="checkout-card__title">{t('checkout.shipping')}</h2>

            {addresses.length > 1 && (
              <div className="address-picker" role="radiogroup" aria-label={t('checkout.savedAddresses')}>
                {addresses.map((address) => (
                  <label key={address.id} className="address-picker__option">
                    <input
                      type="radio"
                      name="saved-address"
                      checked={selectedAddress === address.id}
                      onChange={() => chooseAddress(address)}
                    />
                    <span className="address-picker__text">
                      <strong>{address.label || address.fullName}</strong>
                      <span>{address.city}, {address.address}</span>
                      <span>{t('checkout.phoneValue', { phone: address.phone })}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="checkout-card__grid">
              <FormField id="shipping-fullName" label={t('checkout.fullName')} error={errors.shipping?.fullName?.message}>
                <Input
                  id="shipping-fullName"
                  autoComplete="name"
                  error={!!errors.shipping?.fullName}
                  {...register('shipping.fullName')}
                />
              </FormField>

              <FormField id="shipping-phone" label={t('checkout.phone')} error={errors.shipping?.phone?.message}>
                <Input
                  id="shipping-phone"
                  type="tel"
                  autoComplete="tel"
                  error={!!errors.shipping?.phone}
                  {...register('shipping.phone')}
                />
              </FormField>

              <FormField id="shipping-city" label={t('checkout.city')} error={errors.shipping?.city?.message}>
                <Input
                  id="shipping-city"
                  autoComplete="address-level2"
                  error={!!errors.shipping?.city}
                  {...register('shipping.city')}
                />
              </FormField>

              <FormField id="shipping-address" label={t('checkout.address')} error={errors.shipping?.address?.message}>
                <Input
                  id="shipping-address"
                  autoComplete="street-address"
                  error={!!errors.shipping?.address}
                  {...register('shipping.address')}
                />
              </FormField>
            </div>
          </section>

          <section className="checkout-card" aria-labelledby="card-title">
            <h2 id="card-title" className="checkout-card__title">{t('checkout.payment')}</h2>

            {cardError && (
              <div className="payment-failed" role="alert">
                <span className="payment-failed__icon" aria-hidden="true">✕</span>
                <div>
                  <p className="payment-failed__title">{t('checkout.paymentFailed')}</p>
                  <p className="payment-failed__text">{cardError}</p>
                </div>
              </div>
            )}

            <FormField id="card-number" label={t('checkout.cardNumber')} error={errors.card?.number?.message}>
              <Input
                id="card-number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                error={!!errors.card?.number}
                {...register('card.number', {
                  onChange: (e) => setValue('card.number', formatCardNumber(e.target.value)),
                })}
              />
            </FormField>

            <FormField id="card-holder" label={t('checkout.cardHolder')} error={errors.card?.holder?.message}>
              <Input
                id="card-holder"
                autoComplete="cc-name"
                placeholder="TAMARI TABATADZE"
                error={!!errors.card?.holder}
                {...register('card.holder')}
              />
            </FormField>

            <div className="checkout-card__grid">
              <FormField id="card-expiry" label={t('checkout.cardExpiry')} error={errors.card?.expiry?.message}>
                <Input
                  id="card-expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  error={!!errors.card?.expiry}
                  {...register('card.expiry', {
                    onChange: (e) => {
                      const isDeleting = e.nativeEvent?.inputType?.startsWith('delete')
                      setValue('card.expiry', formatExpiry(e.target.value, isDeleting))
                    },
                  })}
                />
              </FormField>

              <FormField id="card-cvc" label={t('checkout.cardCvc')} error={errors.card?.cvc?.message}>
                <Input
                  id="card-cvc"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  error={!!errors.card?.cvc}
                  {...register('card.cvc')}
                />
              </FormField>
            </div>
          </section>
        </fieldset>

        <aside className="checkout-summary" aria-label={t('checkout.summary')}>
          <h2 className="checkout-summary__title">{t('checkout.summary')}</h2>

          <ul className="checkout-summary__items">
            {items.map((item) => (
              <li key={item.id} className="checkout-summary__item">
                <img src={item.product.image} alt="" className="checkout-summary__image" />
                <div>
                  <p className="checkout-summary__name">{item.product.title}</p>
                  <p className="checkout-summary__qty">
                    {item.qty} × <strong>{formatPrice(item.product.price)}</strong>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="checkout-summary__row">
            <span>{t('checkout.products')}</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="checkout-summary__row">
            <span>{t('checkout.shippingFee')}</span>
            <span>{shippingFee === 0 ? t('checkout.free') : formatPrice(shippingFee)}</span>
          </p>
          {untilFree > 0 && (
                        <p className="checkout-summary__hint">
              {t('checkout.untilFree', { amount: formatPrice(untilFree) })}
            </p>
          )}
          <p className="checkout-summary__row checkout-summary__row--total">
            <span>{t('checkout.total')}</span>
            <span>{formatPrice(total)}</span>
          </p>

          <Button type="submit" loading={isSubmitting}>
            {t('checkout.pay')}
          </Button>
        </aside>
      </form>
    </section>
  )
}
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
import './CheckoutPage.css'

const SERVER_FIELDS = [
  'shipping.fullName', 'shipping.phone', 'shipping.city', 'shipping.address',
  'card.number', 'card.holder', 'card.expiry', 'card.cvc',
]

export default function CheckoutPage() {
  const { data, isPending, isError, refetch } = useCheckout()

  if (isPending) {
    return (
      <section className="checkout-page" aria-busy="true">
        <div className="skeleton checkout-page__skeleton" />
      </section>
    )
  }

  if (isError) {
    return <EmptyState role="alert" title="ვერ ჩაიტვირთა" actionLabel="ხელახლა ცდა" onAction={() => refetch()} />
  }

  if (data.items.length === 0) return <Navigate to="/cart" replace />

  return <CheckoutForm checkout={data} />
}

function CheckoutForm({ checkout }) {
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
        setCardError('ბარათი უარყოფილია, სცადე სხვა ბარათი')
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
      <nav className="checkout-page__breadcrumb" aria-label="ნავიგაცია">
        <Link to="/">მთავარი</Link> / <Link to="/cart">კალათა</Link> / <span>შეკვეთის გაფორმება</span>
      </nav>

      <h1 className="checkout-page__title">შეკვეთის გაფორმება</h1>

      <form className="checkout-page__layout" onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="checkout-page__main" disabled={isSubmitting}>
          {formError && <Alert variant="error">{formError}</Alert>}
          {stockError && (
            <Alert variant="error">
              ზოგი პროდუქტი აღარ არის საკმარისი რაოდენობით. <Link to="/cart">კალათაში დაბრუნება</Link>
            </Alert>
          )}

          <section className="checkout-card" aria-labelledby="shipping-title">
            <h2 id="shipping-title" className="checkout-card__title">მიწოდება</h2>

            {addresses.length > 1 && (
              <div className="address-picker" role="radiogroup" aria-label="შენახული მისამართები">
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
                      <span>ტელეფონი: {address.phone}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="checkout-card__grid">
              <FormField id="shipping-fullName" label="მიმღები" error={errors.shipping?.fullName?.message}>
                <Input
                  id="shipping-fullName"
                  autoComplete="name"
                  error={!!errors.shipping?.fullName}
                  {...register('shipping.fullName')}
                />
              </FormField>

              <FormField id="shipping-phone" label="ტელეფონი" error={errors.shipping?.phone?.message}>
                <Input
                  id="shipping-phone"
                  type="tel"
                  autoComplete="tel"
                  error={!!errors.shipping?.phone}
                  {...register('shipping.phone')}
                />
              </FormField>

              <FormField id="shipping-city" label="ქალაქი" error={errors.shipping?.city?.message}>
                <Input
                  id="shipping-city"
                  autoComplete="address-level2"
                  error={!!errors.shipping?.city}
                  {...register('shipping.city')}
                />
              </FormField>

              <FormField id="shipping-address" label="მისამართი" error={errors.shipping?.address?.message}>
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
            <h2 id="card-title" className="checkout-card__title">ბარათით გადახდა</h2>

            {/* Figma: Payment Failed */}
            {cardError && (
              <div className="payment-failed" role="alert">
                <span className="payment-failed__icon" aria-hidden="true">✕</span>
                <div>
                  <p className="payment-failed__title">გადახდა ვერ მოხერხდა</p>
                  <p className="payment-failed__text">{cardError}</p>
                </div>
              </div>
            )}

            <FormField id="card-number" label="ბარათის ნომერი" error={errors.card?.number?.message}>
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

            <FormField id="card-holder" label="ბარათის მფლობელი" error={errors.card?.holder?.message}>
              <Input
                id="card-holder"
                autoComplete="cc-name"
                placeholder="TAMARI TABATADZE"
                error={!!errors.card?.holder}
                {...register('card.holder')}
              />
            </FormField>

            <div className="checkout-card__grid">
              <FormField id="card-expiry" label="ვადა (MM/YY)" error={errors.card?.expiry?.message}>
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

              <FormField id="card-cvc" label="CVC" error={errors.card?.cvc?.message}>
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

        <aside className="checkout-summary" aria-label="შეკვეთის შეჯამება">
          <h2 className="checkout-summary__title">შეკვეთის შეჯამება</h2>

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
            <span>პროდუქტები</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="checkout-summary__row">
            <span>მიწოდება</span>
            <span>{shippingFee === 0 ? 'უფასო' : formatPrice(shippingFee)}</span>
          </p>
          {untilFree > 0 && (
            <p className="checkout-summary__hint">კიდევ {formatPrice(untilFree)} და მიწოდება უფასოა</p>
          )}
          <p className="checkout-summary__row checkout-summary__row--total">
            <span>სულ</span>
            <span>{formatPrice(total)}</span>
          </p>

          <Button type="submit" loading={isSubmitting}>
            გადახდა
          </Button>
        </aside>
      </form>
    </section>
  )
}
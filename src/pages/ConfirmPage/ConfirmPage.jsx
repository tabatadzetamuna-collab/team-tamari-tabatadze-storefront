import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from '../../session/useSession'
import { orderService } from '../../shared/services/orderService'
import FormField from '../../shared/ui/FormField/FormField'
import Input from '../../shared/ui/Input/Input'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import { KeyIcon } from '../../shared/ui/icons/icons'
import { codeSchema } from '../../shared/lib/validation'
import { describeError } from '../../shared/lib/mapServerErrors'
import './ConfirmPage.css'

const RESEND_SECONDS = 30

export default function ConfirmPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useSession()

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [banner, setBanner] = useState(null)
  const [notice, setNotice] = useState(null)
  const [resending, setResending] = useState(false)

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

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const goToOrder = () => navigate(`/orders/${orderId}`, { replace: true })

  async function onSubmit({ code }) {
    setBanner(null)
    setNotice(null)
    try {
      const { order } = await orderService.confirm(orderId, code)
      queryClient.setQueryData(['cart', user?.id], (prev) =>
        prev ? { ...prev, items: [], totalQty: 0, subtotal: 0 } : prev
      )
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
      queryClient.removeQueries({ queryKey: ['checkout'] })
      queryClient.setQueryData(['order', orderId], { order })
      goToOrder()
    } catch (error) {
      if (error.code === 'INVALID_PAYMENT_CODE') {
        setError('code', { type: 'server', message: 'კოდი არასწორია ან ვადაგასულია' }, { shouldFocus: true })
        return
      }
      if (error.code === 'TOO_MANY_ATTEMPTS') {
        setBanner('tooMany')
        return
      }
      if (error.code === 'ORDER_ALREADY_PAID') {
        goToOrder()
        return
      }
      if (error.code === 'INSUFFICIENT_STOCK') {
        setBanner('stock')
        return
      }
      setBanner(describeError(error))
    }
  }

  async function resend() {
    setResending(true)
    setNotice(null)
    try {
      await orderService.resendCode(orderId)
      setBanner(null)
      setNotice('ახალი კოდი გაიგზავნა')
      setSecondsLeft(RESEND_SECONDS)
    } catch (error) {
      if (error.code === 'RESEND_TOO_SOON') {
        setSecondsLeft(error.data?.retryAfterSeconds ?? RESEND_SECONDS)
        return
      }
      if (error.code === 'ORDER_ALREADY_PAID') {
        goToOrder()
        return
      }
      setBanner(describeError(error))
    } finally {
      setResending(false)
    }
  }

  const otherError = banner && banner !== 'tooMany' && banner !== 'stock'

  return (
    <section className="confirm-page">
      <div className="confirm-card">
        <span className="confirm-card__icon" aria-hidden="true">
          <KeyIcon />
        </span>
        <h1 className="confirm-card__title">გადახდის დადასტურება</h1>
        <p className="confirm-card__text">
          კოდი გამოგზავნილია <strong>{user?.email}</strong>-ზე. მოქმედებს 10 წუთი.
        </p>

        {notice && <Alert variant="success">{notice}</Alert>}
        {banner === 'tooMany' && (
          <Alert variant="error">ბევრი არასწორი მცდელობა, ლიმიტი ამოიწურა. მოითხოვე ახალი კოდი.</Alert>
        )}
        {banner === 'stock' && (
          <Alert variant="error">
          საკმარისი რაოდენობა არ არის<Link to="/cart">კალათაში დაბრუნება</Link>
          </Alert>
        )}
        {otherError && <Alert variant="error">{banner}</Alert>}

        <form className="confirm-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="confirm-form__fieldset" disabled={isSubmitting}>
            <FormField id="code" label="6-ციფრიანი კოდი" error={errors.code?.message}>
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

        <button
          type="button"
          className="confirm-card__resend"
          disabled={secondsLeft > 0 || resending}
          onClick={resend}
        >
          {secondsLeft > 0
            ? `ხელახლა გაგზავნა (${secondsLeft} წმ)`
            : banner === 'tooMany'
              ? 'ახალი კოდის მოთხოვნა'
              : 'ხელახლა გაგზავნა'}
        </button>
      </div>
    </section>
  )
}
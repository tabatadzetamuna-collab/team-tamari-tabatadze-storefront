import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import { useCartMutations } from './useCart'
import { cartErrorText } from './cartErrors'
import Button from '../../shared/ui/Button/Button'
import { CART_MAX_QTY } from '../../config'
import './cart.css'

export default function AddToCartButton({ product }) {
  const { status } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const { add } = useCartMutations()
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState(null)

  const max = Math.min(product.stock, CART_MAX_QTY)
  const disabled = !product.inStock

  const goToLogin = () => navigate('/login', { state: { from: location } })

  async function handleClick() {
    if (status !== 'signedIn') {
      goToLogin()
      return
    }
    setMessage(null)
    try {
      await add.mutateAsync({ productId: product.id, qty })
      setMessage({ type: 'success', text: 'დაემატა კალათაში' })
    } catch (error) {
      if (error.status === 401) {
        goToLogin()
        return
      }
      setMessage({ type: 'error', text: cartErrorText(error) })
    }
  }

  return (
    <div className="add-to-cart">
      <div className="add-to-cart__row">
        <div className="stepper" role="group" aria-label="რაოდენობა">
          <button
            type="button"
            className="stepper__button"
            aria-label="რაოდენობის შემცირება"
            disabled={disabled || qty <= 1}
            onClick={() => setQty((q) => q - 1)}
          >
            −
          </button>
          <span className="stepper__value" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="stepper__button"
            aria-label="რაოდენობის გაზრდა"
            disabled={disabled || qty >= max}
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>

        <Button onClick={handleClick} loading={add.isPending} disabled={disabled || status === 'checking'}>
          {disabled ? 'ამოწურულია' : 'კალათაში დამატება'}
        </Button>
      </div>

      <p
        role="status"
        className={`add-to-cart__message add-to-cart__message--${message?.type ?? 'none'}`}
      >
        {message?.text}
        {message?.type === 'success' && (
          <>
            {' '}
            <Link to="/cart">კალათის ნახვა</Link>
          </>
        )}
      </p>
    </div>
  )
}
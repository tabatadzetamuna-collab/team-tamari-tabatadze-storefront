import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import { useCartMutations } from './useCart'
import Button from '../../shared/ui/Button/Button'
import { cartErrorText } from './cartErrors'
import './cart.css'



export default function AddToCartButton({ product }) {
  const { status } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const { add } = useCartMutations()
  const [message, setMessage] = useState(null)

  const goToLogin = () => navigate('/login', { state: { from: location } })

  async function handleClick() {
    if (status !== 'signedIn') {
      goToLogin()
      return
    }
    setMessage(null)
    try {
      await add.mutateAsync({ productId: product.id, qty: 1 })
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
      <Button
        onClick={handleClick}
        loading={add.isPending}
        disabled={!product.inStock || status === 'checking'}
      >
        {product.inStock ? 'კალათაში დამატება' : 'ამოწურულია'}
      </Button>

      <p
        role="status"
        className={`add-to-cart__message add-to-cart__message--${message?.type ?? 'none'}`}
      >
        {message?.text}
      </p>
    </div>
  )
}
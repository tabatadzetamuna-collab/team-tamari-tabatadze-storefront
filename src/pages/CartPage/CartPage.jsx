import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useCartMutations } from '../../features/cart/useCart'
import CartLine from '../../features/cart/CartLine'
import { cartErrorText } from '../../features/cart/cartErrors'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import Button from '../../shared/ui/Button/Button'
import { formatPrice } from '../../shared/lib/formatPrice'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { data: cart, isPending, isError, refetch } = useCart()
  const { update, remove } = useCartMutations()
  const [lineErrors, setLineErrors] = useState({})

  const setLineError = (itemId, text) => setLineErrors((prev) => ({ ...prev, [itemId]: text }))

  async function changeQty(item, qty) {
    setLineError(item.id, null)
    try {
      await update.mutateAsync({ itemId: item.id, qty })
    } catch (error) {
      setLineError(item.id, cartErrorText(error))
      if (error.code === 'CART_ITEM_NOT_FOUND') refetch()
    }
  }

  async function removeItem(item) {
    setLineError(item.id, null)
    try {
      await remove.mutateAsync(item.id)
    } catch (error) {
      setLineError(item.id, cartErrorText(error))
      if (error.code === 'CART_ITEM_NOT_FOUND') refetch()
    }
  }

  const isPendingLine = (itemId) =>
    (update.isPending && update.variables?.itemId === itemId) ||
    (remove.isPending && remove.variables === itemId)

  if (isPending) {
    return (
      <section className="cart-page" aria-busy="true">
        <h1 className="cart-page__title">კალათა</h1>
        <div className="skeleton cart-page__skeleton" />
        <div className="skeleton cart-page__skeleton" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="cart-page">
        <h1 className="cart-page__title">კალათა</h1>
        <EmptyState role="alert" title="ვერ ჩაიტვირთა" actionLabel="ხელახლა ცდა" onAction={() => refetch()} />
      </section>
    )
  }

  if (cart.items.length === 0) {
    return (
      <section className="cart-page">
        <h1 className="cart-page__title">კალათა</h1>
        <EmptyState
          title="კალათა ცარიელია"
          actionLabel="კატალოგში დაბრუნება"
          onAction={() => navigate('/catalog')}
        />
      </section>
    )
  }

  const hasStockProblem = cart.items.some((item) => item.qty > item.product.stock)

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">კალათა</h1>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {cart.items.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              pending={isPendingLine(item.id)}
              error={lineErrors[item.id]}
              onChangeQty={(qty) => changeQty(item, qty)}
              onRemove={() => removeItem(item)}
            />
          ))}
        </ul>

        <aside className="cart-summary" aria-label="შეკვეთის ჯამი">
          <h2 className="cart-summary__title">ჯამი</h2>
          <p className="cart-summary__row">
            <span>ნივთები</span>
            <span>{cart.totalQty}</span>
          </p>
          <p className="cart-summary__row cart-summary__row--total">
            <span>სულ</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </p>

          <Button disabled={hasStockProblem} onClick={() => navigate('/checkout')}>
            ჩექაუთზე გადასვლა
          </Button>
          {hasStockProblem && (
            <p className="cart-summary__hint">ჯერ რაოდენობა მარაგს შეუსაბამე</p>
          )}
        </aside>
      </div>
    </section>
  )
}
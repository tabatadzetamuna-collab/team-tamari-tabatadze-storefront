import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useCartMutations } from '../../features/cart/useCart'
import CartLine from '../../features/cart/CartLine'
import { cartErrorText } from '../../features/cart/cartErrors'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import Button from '../../shared/ui/Button/Button'
import { formatPrice } from '../../shared/lib/formatPrice'
import { useTranslation } from 'react-i18next'
import './CartPage.css'

export default function CartPage() {
  const { t } = useTranslation()
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
      await remove.mutateAsync({ itemId: item.id })
    } catch (error) {
      setLineError(item.id, cartErrorText(error))
      if (error.code === 'CART_ITEM_NOT_FOUND') refetch()
    }
  }

  const busy = update.isPending || remove.isPending

  if (isPending) {
    return (
      <section className="cart-page" aria-busy="true">
        <h1 className="cart-page__title">{t('cart.title')}</h1>
        <div className="skeleton cart-page__skeleton" />
        <div className="skeleton cart-page__skeleton" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="cart-page">
        <h1 className="cart-page__title">{t('cart.title')}</h1>
        <EmptyState role="alert" title={t('common.loadFailed')} actionLabel={t('common.retry')} onAction={() => refetch()} />
      </section>
    )
  }

  if (cart.items.length === 0) {
    return (
      <section className="cart-page">
        <h1 className="cart-page__title">{t('cart.title')}</h1>
        <EmptyState
          title={t('cart.empty')}
          actionLabel={t('product.backToCatalog')}
          onAction={() => navigate('/catalog')}
        />
      </section>
    )
  }

  const hasStockProblem = cart.items.some((item) => item.qty > item.product.stock)

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">
         {t('cart.title')} <span className="cart-page__count">{t('cart.items', { count: cart.totalQty })}</span>
      </h1>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {cart.items.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              pending={busy}
              error={lineErrors[item.id]}
              onChangeQty={(qty) => changeQty(item, qty)}
              onRemove={() => removeItem(item)}
            />
          ))}
        </ul>

        <aside className="cart-summary" aria-label={t('cart.summaryLabel')}>
          <h2 className="cart-summary__title">{t('cart.summary')}</h2>
          <p className="cart-summary__row">
            <span>{t('cart.itemsLabel')}</span>
            <span>{cart.totalQty}</span>
          </p>
          <p className="cart-summary__row cart-summary__row--total">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </p>

          <Button disabled={hasStockProblem} onClick={() => navigate('/checkout')}>
            {t('cart.checkout')}
          </Button>
          {hasStockProblem && (
            <p className="cart-summary__hint">{t('cart.fixStock')}</p>
          )}
        </aside>
      </div>
    </section>
  )
}
import { Link } from 'react-router-dom'
import { formatPrice } from '../../shared/lib/formatPrice'
import { TrashIcon } from '../../shared/ui/icons/icons'
import { CART_MAX_QTY } from '../../config'
import { useTranslation } from 'react-i18next'
import './cart.css'

export default function CartLine({ item, pending, error, onChangeQty, onRemove }) {
  const { t } = useTranslation()
  const { qty, lineTotal, product } = item
  const max = Math.min(product.stock, CART_MAX_QTY)
  const overStock = qty > product.stock

  return (
    <li className="cart-line">
      <img src={product.image} alt="" className="cart-line__image" />

      <div className="cart-line__info">
        <Link to={`/product/${product.slug}`} className="cart-line__title">
          {product.title}
        </Link>
        <p className="cart-line__price">{formatPrice(product.price)}</p>

        {overStock ? (
          <p className="cart-line__warning" role="alert">
            {t('cart.errors.onlyLeft', { count: product.stock })}
          </p>
        ) : (
          <p className="cart-line__stock">{t('product.inStock')}</p>
        )}
        {error && (
          <p className="cart-line__warning" role="alert">
            {error}
          </p>
        )}

        <div className="cart-line__controls">
          <div className="stepper" role="group" aria-label={t('cart.quantityFor', { title: product.title })}>
            <button
              type="button"
              className="stepper__button"
              aria-label={t('cart.decrease')}
              disabled={pending || qty <= 1}
              onClick={() => onChangeQty(qty - 1)}
            >
              −
            </button>
            <span className="stepper__value" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="stepper__button"
              aria-label={t('cart.increase')}
              disabled={pending || qty >= max}
              onClick={() => onChangeQty(qty + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-line__remove"
            aria-label={t('cart.remove', { title: product.title })}
            disabled={pending}
            onClick={onRemove}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="cart-line__total">
        <span className="cart-line__total-label">{t('cart.lineTotal', { count: qty })}</span>
        <span className="cart-line__total-value">{formatPrice(lineTotal)}</span>
      </div>
    </li>
  )
}
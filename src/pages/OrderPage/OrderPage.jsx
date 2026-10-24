import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../../session/useSession'
import { orderService } from '../../shared/services/orderService'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { formatDate, formatPrice } from '../../shared/lib/formatPrice'
import { useTranslation } from 'react-i18next'
import './OrderPage.css'

export default function OrderPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { user } = useSession()
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.get(id),
  })

  if (isPending) {
    return (
      <section className="order-page" aria-busy="true">
        <div className="skeleton order-page__skeleton" />
      </section>
    )
  }

  if (isError) {
    if (error.code === 'ORDER_NOT_FOUND') {
      return <EmptyState title={t('order.notFound')} />
    }
    return <EmptyState role="alert" title={t('common.loadFailed')} actionLabel={t('common.retry')} onAction={() => refetch()} />
  }

  const { order } = data
  const number = order.id.slice(-8).toUpperCase()

  if (order.status !== 'paid') {
    return (
      <section className="order-page">
        <EmptyState title={t('order.notPaid')}>
          <Link to={`/checkout/confirm/${order.id}`}>{t('order.enterCode')}</Link>
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="order-page">
      <nav className="order-page__breadcrumb" aria-label={t('product.breadcrumb')}>
        <Link to="/">{t('product.home')}</Link> / <span>{t('order.breadcrumb')}</span>
      </nav>

      <div className="order-success" role="status">
        <span className="order-success__icon" aria-hidden="true">✓</span>
        <h1 className="order-success__title">{t('order.thanks', { number })}</h1>

        <dl className="order-success__details">
          <div>
            <dt>{t('order.payment')}</dt>
            <dd>
              {order.payment.brand.toUpperCase()} •••• {order.payment.last4}
            </dd>
          </div>
          <div>
            <dt>{t('order.email')}</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>{t('order.date')}</dt>
            <dd>{formatDate(order.paidAt ?? order.createdAt)}</dd>
          </div>
          <div className="order-success__paid">
            <dt>{t('order.paid')}</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <Link to="/catalog" className="button">
          {t('order.continue')}
        </Link>
      </div>

      <div className="order-detail">
        <div className="order-detail__head">
          <div>
            <p className="order-detail__number">#{number}</p>
            <p className="order-detail__meta">
              {t('order.productsCount', { count: order.items.length })} · {formatDate(order.createdAt)}
            </p>
          </div>
          <p className="order-detail__total">{formatPrice(order.total)}</p>
        </div>

        <h2 className="order-detail__title">{t('order.productsTitle', { count: order.items.length })}</h2>
        <ul className="order-items">
          <li className="order-items__row order-items__row--head" aria-hidden="true">
            <span>{t('order.product')}</span>
            <span>{t('order.price')}</span>
            <span>{t('order.quantity')}</span>
            <span>{t('order.lineTotal')}</span>
          </li>
          {order.items.map((item) => (
            <li key={`${item.slug}-${item.title}`} className="order-items__row">
              <span className="order-items__product">
                <img src={item.image} alt="" />
                {item.slug ? <Link to={`/product/${item.slug}`}>{item.title}</Link> : item.title}
              </span>
              <span>{formatPrice(item.price)}</span>
              <span>× {item.qty}</span>
              <span className="order-items__line">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="order-detail__bottom">
          <div>
            <h3 className="order-detail__subtitle">{t('order.shippingAddress')}</h3>
            <p className="order-detail__strong">{order.shipping.fullName}</p>
            <p>{order.shipping.city}, {order.shipping.address}</p>
            <p>{t('checkout.phoneValue', { phone: order.shipping.phone })}</p>
          </div>

          <div className="order-detail__sums">
            <p>
              <span>{t('checkout.products')}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </p>
            <p>
              <span>{t('checkout.shippingFee')}</span>
              <span>{order.shippingFee === 0 ? t('checkout.free') : formatPrice(order.shippingFee)}</span>
            </p>
            <p className="order-detail__sum-total">
              <span>{t('checkout.total')}</span>
              <span>{formatPrice(order.total)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
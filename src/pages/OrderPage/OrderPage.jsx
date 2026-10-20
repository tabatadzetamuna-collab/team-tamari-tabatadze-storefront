import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../../session/useSession'
import { orderService } from '../../shared/services/orderService'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { formatPrice } from '../../shared/lib/formatPrice'
import './OrderPage.css'

const dateFormatter = new Intl.DateTimeFormat('ka-GE', { dateStyle: 'long', timeStyle: 'short' })

export default function OrderPage() {
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
      return <EmptyState title="შეკვეთა არ მოიძებნა" />
    }
    return <EmptyState role="alert" title="ვერ ჩაიტვირთა" actionLabel="ხელახლა ცდა" onAction={() => refetch()} />
  }

  const { order } = data
  const number = order.id.slice(-8).toUpperCase()

  if (order.status !== 'paid') {
    return (
      <section className="order-page">
        <EmptyState title="გადახდა ჯერ არ დასრულებულა">
          <Link to={`/checkout/confirm/${order.id}`}>კოდის შეყვანა</Link>
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="order-page">
      <nav className="order-page__breadcrumb" aria-label="ნავიგაცია">
        <Link to="/">მთავარი</Link> / <span>შეკვეთა</span>
      </nav>

      <div className="order-success" role="status">
        <span className="order-success__icon" aria-hidden="true">✓</span>
        <h1 className="order-success__title">მადლობა! შეკვეთა №{number} გადახდილია</h1>

        <dl className="order-success__details">
          <div>
            <dt>გადახდა</dt>
            <dd>
              {order.payment.brand.toUpperCase()} •••• {order.payment.last4}
            </dd>
          </div>
          <div>
            <dt>ელფოსტა</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>თარიღი</dt>
            <dd>{dateFormatter.format(new Date(order.paidAt ?? order.createdAt))}</dd>
          </div>
          <div className="order-success__paid">
            <dt>გადახდილი თანხა</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <Link to="/catalog" className="button">
          შოპინგის გაგრძელება
        </Link>
      </div>

      {/* Figma: Order Detail */}
      <div className="order-detail">
        <div className="order-detail__head">
          <div>
            <p className="order-detail__number">#{number}</p>
            <p className="order-detail__meta">
              {order.items.length} პროდუქტი · {dateFormatter.format(new Date(order.createdAt))}
            </p>
          </div>
          <p className="order-detail__total">{formatPrice(order.total)}</p>
        </div>

        <h2 className="order-detail__title">პროდუქტები ({order.items.length})</h2>

        <ul className="order-items">
          <li className="order-items__row order-items__row--head" aria-hidden="true">
            <span>პროდუქტი</span>
            <span>ფასი</span>
            <span>რაოდენობა</span>
            <span>ჯამი</span>
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
            <h3 className="order-detail__subtitle">მიწოდების მისამართი</h3>
            <p className="order-detail__strong">{order.shipping.fullName}</p>
            <p>{order.shipping.city}, {order.shipping.address}</p>
            <p>ტელეფონი: {order.shipping.phone}</p>
          </div>

          <div className="order-detail__sums">
            <p>
              <span>პროდუქტები</span>
              <span>{formatPrice(order.subtotal)}</span>
            </p>
            <p>
              <span>მიწოდება</span>
              <span>{order.shippingFee === 0 ? 'უფასო' : formatPrice(order.shippingFee)}</span>
            </p>
            <p className="order-detail__sum-total">
              <span>სულ</span>
              <span>{formatPrice(order.total)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
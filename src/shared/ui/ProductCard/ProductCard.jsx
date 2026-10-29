import { Link } from 'react-router-dom'
import { formatPrice } from '../../lib/formatPrice'
import { useTranslation } from 'react-i18next'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { t } = useTranslation()
  const { slug, title, brand, image, price, oldPrice, discountPercent, rating, reviewsCount, inStock } =
    product

  return (
    <article className="product-card">
      <Link to={`/product/${slug}`} className="product-card__link">
        <div className="product-card__media">
          <img src={image} alt={title} loading="lazy" className="product-card__image" />
          {discountPercent && <span className="product-card__badge">−{discountPercent}%</span>}
        </div>

        <div className="product-card__row">
          <p className="product-card__price">
            {formatPrice(price)}
            {oldPrice && (
              <s className="product-card__price-old">
                <span className="visually-hidden">{t('product.oldPrice')} </span>
                {formatPrice(oldPrice)}
              </s>
            )}
          </p>
          <p className="product-card__rating">
            <span aria-hidden="true">★</span> {rating}
            <span className="visually-hidden">, </span>
            <span className="product-card__reviews">({reviewsCount})</span>
          </p>
        </div>

        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__brand">{brand}</p>

        <p className={`product-card__stock ${inStock ? '' : 'product-card__stock--out'}`}>
          {inStock ? t('product.inStock') : t('product.outOfStock')}
        </p>
      </Link>
    </article>
  )
}
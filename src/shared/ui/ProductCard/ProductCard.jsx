import { Link } from 'react-router-dom'
import { formatPrice } from '../../lib/formatPrice'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { slug, title, brand, image, price, oldPrice, discountPercent, rating, reviewsCount, inStock } =
    product

  return (
    <article className="product-card">
      <Link to={`/product/${slug}`} className="product-card__link">
        <div className="product-card__media">
          <img src={image} alt={title} loading="lazy" className="product-card__image" />
          {discountPercent && (
            <span className="product-card__badge">−{discountPercent}%</span>
          )}
        </div>

        <p className="product-card__brand">{brand}</p>
        <h3 className="product-card__title">{title}</h3>
      </Link>

      <p className="product-card__rating">
        <span aria-hidden="true">★</span> {rating}
        <span className="product-card__reviews"> ({reviewsCount} შეფასება)</span>
      </p>

      <p className="product-card__price">
        <span className="product-card__price-current">{formatPrice(price)}</span>
        {oldPrice && (
          <s className="product-card__price-old">
            <span className="visually-hidden">ძველი ფასი: </span>
            {formatPrice(oldPrice)}
          </s>
        )}
      </p>

      <p className={`product-card__stock ${inStock ? '' : 'product-card__stock--out'}`}>
        {inStock ? 'მარაგშია' : 'ამოწურულია'}
      </p>
    </article>
  )
}
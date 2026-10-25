import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductGallery from '../../features/catalog/ProductGallery/ProductGallery'
import SpecsTable from '../../features/catalog/SpecsTable/SpecsTable'
import AddToCartButton from '../../features/cart/AddToCartButton'
import ProductCard from '../../shared/ui/ProductCard/ProductCard'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { MessageIcon } from '../../shared/ui/icons/icons'
import { useCategory, useProduct } from '../../features/catalog/useCatalogQueries'
import { formatPrice } from '../../shared/lib/formatPrice'
import { CATEGORY_SLUG } from '../../config'
import './ProductPage.css'

function stockInfo(inStock, stock, t) {
  if (!inStock) return { text: t('product.outOfStock'), className: 'product-page__stock--out' }
  if (stock <= 5) return { text: t('product.lowStock', { count: stock }), className: 'product-page__stock--low' }
  return { text: t('product.inStock'), className: 'product-page__stock--ok' }
}

export default function ProductPage() {
  const { t, i18n } = useTranslation()
  const categoryQuery = useCategory(CATEGORY_SLUG)
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, isPending, isError, error, refetch } = useProduct(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const title = product?.title
  useEffect(() => {
    if (!title) return
    document.title = `${title} — Cyber`
    return () => {
      document.title = 'Cyber'
    }
  }, [title])

  if (isPending) {
    return (
      <div className="product-page product-page--loading" aria-busy="true">
        <div className="skeleton product-page__skeleton-image" />
        <div className="product-page__info">
          <div className="skeleton skeleton--text skeleton--short" />
          <div className="skeleton skeleton--text" />
          <div className="skeleton skeleton--text skeleton--short" />
        </div>
      </div>
    )
  }

  if (isError) {
    if (error.status === 404) {
      return (
        <EmptyState
          title={t('product.notFound')}
          actionLabel={t('product.backToCatalog')}
          onAction={() => navigate('/catalog')}
        />
      )
    }
    return (
      <EmptyState
        role="alert"
        title={t('common.loadFailed')}
        actionLabel={t('product.tryAgain')}
        onAction={() => refetch()}
      />
    )
  }

  const {
    brand, images, price, oldPrice, discountPercent, rating, reviewsCount,
    inStock, stock, warrantyMonths, description, specs, category, related,
  } = product
  const stockState = stockInfo(inStock, stock, t)
  const categoryName =
    (i18n.language === 'en' ? categoryQuery.data?.nameEn : categoryQuery.data?.name) ?? category.name

  return (
    <article className="product-page">
      <nav className="product-page__breadcrumb" aria-label={t('product.breadcrumb')}>
        <Link to="/">{t('product.home')}</Link> / <Link to="/catalog">{categoryName}</Link> /{' '}
        <span>{title}</span>
      </nav>

      <div className="product-page__top">
        <ProductGallery key={slug} images={images} title={title} />

        <div className="product-page__info">
          <div>
            <p className="product-page__brand">{brand}</p>
            <h1 className="product-page__title">{title}</h1>
          </div>

          <div className="product-page__price-row">
            <span className="product-page__price">{formatPrice(price)}</span>
            <span className="product-page__pill product-page__pill--rating">
              <span aria-hidden="true">★</span> {rating}
            </span>
            <span className="product-page__pill">
              <MessageIcon /> {t('product.reviews', { count: reviewsCount })}
            </span>
          </div>

          {oldPrice && (
            <p className="product-page__old-price">
              <s>
                <span className="visually-hidden">{t('product.oldPrice')}</span>
                {formatPrice(oldPrice)}
              </s>
              <span className="product-page__discount">−{discountPercent}%</span>
            </p>
          )}

          <ul className="product-page__facts">
            <li>
              <span className="product-page__fact-label">{t('product.stock')}</span>
              <span className={stockState.className}>{stockState.text}</span>
            </li>
            {warrantyMonths > 0 && (
              <li>
                <span className="product-page__fact-label">{t('product.warranty')}</span>
                <span>{t('product.warrantyMonths', { count: warrantyMonths })}</span>
              </li>
            )}
          </ul>

          <AddToCartButton key={slug} product={product} />
        </div>
      </div>

      <section className="product-page__section" aria-labelledby="description-title">
        <h2 id="description-title" className="product-page__section-title">
          <span>{t('product.description')}</span>
        </h2>
        <p className="product-page__description">{description}</p>
      </section>

      <section className="product-page__section" aria-labelledby="specs-title">
        <h2 id="specs-title" className="product-page__section-title">
          <span>{t('product.specs')}</span>
        </h2>
        <SpecsTable specs={specs} />
      </section>

      {related?.length > 0 && (
        <section className="product-page__section" aria-labelledby="related-title">
          <h2 id="related-title" className="product-page__section-title">
            <span>{t('product.related')}</span>
          </h2>
          <ul className="product-page__related-grid">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
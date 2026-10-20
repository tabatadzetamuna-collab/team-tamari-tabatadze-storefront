import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductGallery from '../../features/catalog/ProductGallery/ProductGallery'
import SpecsTable from '../../features/catalog/SpecsTable/SpecsTable'
import ProductCard from '../../shared/ui/ProductCard/ProductCard'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { useProduct } from '../../features/catalog/useCatalogQueries'
import { formatPrice } from '../../shared/lib/formatPrice'
import './ProductPage.css'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: product, isPending, isError, error, refetch } = useProduct(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

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
          title="პროდუქტი არ მოიძებნა"
          actionLabel="დაბრუნება მაღაზიაში"
          onAction={() => navigate('/catalog')}
        />
      )
    }
    return (
      <EmptyState role="alert" title="ვერ ჩაიტვირთა" actionLabel="ხელახლა ცდა" onAction={() => refetch()} />
    )
  }

  const { title, brand, images, price, oldPrice, discountPercent, inStock, stock, warrantyMonths, specs, related } =
    product

  return (
    <article className="product-page">
      <nav className="product-page__breadcrumb" aria-label="ნავიგაცია">
        <Link to="/">მთავარი</Link> / <Link to="/catalog">მაღაზია</Link> / <span>{title}</span>
      </nav>

      <div className="product-page__top">
        <ProductGallery key={slug} images={images} title={title} />

        <div className="product-page__info">
          <div>
            <p className="product-page__brand">{brand}</p>
            <h1 className="product-page__title">{title}</h1>
          </div>

          <p className="product-page__price">{formatPrice(price)}</p>

          {oldPrice && (
            <p className="product-page__old-price">
              <s>
                <span className="visually-hidden">ძველი ფასი: </span>
                {formatPrice(oldPrice)}
              </s>
              <span className="product-page__discount">−{discountPercent}%</span>
            </p>
          )}

          <ul className="product-page__facts">
            <li>
              <span className="product-page__fact-label">მარაგი</span>
              <span className={inStock ? 'product-page__in-stock' : 'product-page__out-of-stock'}>
                {inStock ? `მარაგშია: ${stock} ცალი` : 'ამოწურულია'}
              </span>
            </li>
            <li>
              <span className="product-page__fact-label">გარანტია</span>
              <span>{warrantyMonths} თვე</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="product-page__section" aria-labelledby="specs-title">
        <h2 id="specs-title" className="product-page__section-title">
          <span>მახასიათებლები</span>
        </h2>
        <SpecsTable specs={specs} />
      </section>

      {related?.length > 0 && (
        <section className="product-page__section" aria-labelledby="related-title">
          <h2 id="related-title" className="product-page__section-title">
            <span>მსგავსი პროდუქტები</span>
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
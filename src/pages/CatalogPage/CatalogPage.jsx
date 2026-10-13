import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../shared/ui/ProductCard/ProductCard'
import { toApiParams } from '../../features/catalog/catalogParams'
import { useProducts } from '../../features/catalog/useCatalogQueries'
import './CatalogPage.css'

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const { data, isPending, isError } = useProducts(toApiParams(searchParams))

  if (isPending) return <p>იტვირთება…</p>
  if (isError) return <p>ვერ ჩაიტვირთა</p>

  return (
    <section className="catalog-page">
      <h1 className="catalog-page__title">სმარტფონები</h1>
      <p className="catalog-page__count">სულ {data.total} პროდუქტი</p>

      <ul className="catalog-page__grid">
        {data.items.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
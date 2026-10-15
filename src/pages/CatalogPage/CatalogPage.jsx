import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../shared/ui/ProductCard/ProductCard'
import ProductCardSkeleton from '../../shared/ui/ProductCard/ProductCardSkeleton'
import Pagination from '../../shared/ui/Pagination/Pagination'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import FilterPanel from '../../features/catalog/FilterPanel/FilterPanel'
import CatalogToolbar from '../../features/catalog/CatalogToolbar/CatalogToolbar'
import { toApiParams, withParam } from '../../features/catalog/catalogParams'
import { useCategory, useProducts } from '../../features/catalog/useCatalogQueries'
import { CATEGORY_SLUG, PAGE_SIZE } from '../../config'
import './CatalogPage.css'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = useCategory(CATEGORY_SLUG)
  const products = useProducts(toApiParams(searchParams))
  const { data } = products
  const listRef = useRef(null)

  function handlePageChange(page) {
    setSearchParams(withParam(searchParams, 'page', page === 1 ? '' : page))
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearAll() {
    const sort = searchParams.get('sort')
    setSearchParams(sort ? { sort } : {})
  }

  function renderResults() {
    if (products.isPending) {
      return (
        <ul className="catalog-page__grid" aria-busy="true">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      )
    }

    if (products.isError) {
      return (
        <EmptyState
          role="alert"
          title="ვერ ჩაიტვირთა"
          actionLabel="ხელახლა ცდა"
          onAction={() => products.refetch()}
        >
          შეამოწმე ინტერნეტი და სცადე თავიდან.
        </EmptyState>
      )
    }

    if (data.items.length === 0) {
      return (
        <EmptyState title="ვერაფერი მოიძებნა" actionLabel="ფილტრების გასუფთავება" onAction={clearAll}>
          სცადე სხვა ფილტრები ან საძიებო სიტყვა.
        </EmptyState>
      )
    }

    const from = (data.page - 1) * data.limit + 1
    const to = Math.min(data.page * data.limit, data.total)

    return (
      <>
        <ul
          className={`catalog-page__grid ${products.isPlaceholderData ? 'catalog-page__grid--stale' : ''}`}
          aria-busy={products.isPlaceholderData}
        >
          {data.items.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        <p className="catalog-page__range">
          ნაჩვენებია {from}–{to}, სულ {data.total}
        </p>

        <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePageChange} />
      </>
    )
  }

  return (
    <section className="catalog-page">
      <h1 className="catalog-page__title">{category.data?.name ?? 'მაღაზია'}</h1>

      <div className="catalog-page__layout">
        {category.data && <FilterPanel filters={category.data.filters} />}

        <div className="catalog-page__main" ref={listRef}>
          <CatalogToolbar total={data?.total} />
          {renderResults()}
        </div>
      </div>
    </section>
  )
}
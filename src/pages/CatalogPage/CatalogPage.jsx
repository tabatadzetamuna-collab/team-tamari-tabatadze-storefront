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
import { useTranslation } from 'react-i18next'
import './CatalogPage.css'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

export default function CatalogPage() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('catalog.title'))
  const [searchParams, setSearchParams] = useSearchParams()
  const category = useCategory(CATEGORY_SLUG)

  const filterKeys =
    category.data?.filters.filter((f) => f.type !== 'range').map((f) => f.key) ?? []

  const products = useProducts(toApiParams(searchParams, filterKeys), {
    enabled: category.isSuccess || category.isError,
  })
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

  function renderSkeleton(className = 'catalog-page__grid') {
    return (
      <ul className={className} aria-busy="true">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  function renderResults() {
    if (products.isPending) return renderSkeleton()

    if (products.isError) {
      return (
        <EmptyState
          role="alert"
          title={t('common.loadFailed')}
          actionLabel={t('common.retry')}
          onAction={() => products.refetch()}
        >
          {t('common.checkConnection')}
        </EmptyState>
      )
    }

    if (data.items.length === 0) {
      return (
        <EmptyState title={t('catalog.emptyTitle')} actionLabel={t('catalog.clearFilters')} onAction={clearAll}>
          {t('catalog.emptyText')}
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
          {t('catalog.range', { from, to, total: data.total })}
        </p>

        <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePageChange} />
      </>
    )
  }

  return (
    <section className="catalog-page">
      <h1 className="catalog-page__title">
        {(i18n.language === 'en' ? category.data?.nameEn : category.data?.name) ?? t('catalog.title')}
      </h1>

      {category.isPending ? (
        renderSkeleton('catalog-page__grid catalog-page__grid--page')
        ) : (
      <div className="catalog-page__layout">
        {category.isError && (
          <p role="alert" className="catalog-page__filters-error">
            {t('catalog.filters.loadFailed')}{' '}
            <button type="button" onClick={() => category.refetch()}>
              {t('common.retry')}
            </button>
          </p>
        )}
        {category.data && <FilterPanel filters={category.data.filters} />}

        <div className="catalog-page__main" ref={listRef}>
          <CatalogToolbar total={data?.total} />
          {renderResults()}
        </div>
      </div>
      )}
    </section>
  )
}
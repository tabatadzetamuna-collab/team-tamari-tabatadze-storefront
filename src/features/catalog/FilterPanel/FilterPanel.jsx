import { useSearchParams } from 'react-router-dom'
import { readList, withParam } from '../catalogParams'
import { CheckboxFilter, RadioFilter, ColorFilter, RangeFilter } from './FilterControls'
import { useTranslation } from 'react-i18next'
import { localizeFilters } from '../filterLabels'
import './FilterPanel.css'

const CONTROLS = {
  checkbox: CheckboxFilter,
  radio: RadioFilter,
  color: ColorFilter,
}

export default function FilterPanel({ filters }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const localized = localizeFilters(filters, i18n.language)

  function setList(key, values) {
    setSearchParams(withParam(searchParams, key, values))
  }

  function setRange(min, max) {
    const next = withParam(withParam(searchParams, 'minPrice', min), 'maxPrice', max)
    setSearchParams(next)
  }

  const filterKeys = [...filters.map((f) => f.key), 'minPrice', 'maxPrice']
  const hasActive = filterKeys.some((key) => searchParams.has(key))

  function clearAll() {
    const next = new URLSearchParams(searchParams)
    filterKeys.forEach((key) => next.delete(key))
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <aside className="filter-panel" aria-label={t('catalog.filters.label')}>
      <div className="filter-panel__head">
        <h2 className="filter-panel__title">{t('catalog.filters.title')}</h2>
        {hasActive && (
          <button type="button" className="filter-panel__clear" onClick={clearAll}>
            {t('catalog.filters.clear')}
          </button>
        )}
      </div>

      {localized.map((filter) => {
        if (filter.type === 'range') {
          return (
            <RangeFilter
              key={filter.key}
              filter={filter}
              minValue={searchParams.get('minPrice') && Number(searchParams.get('minPrice'))}
              maxValue={searchParams.get('maxPrice') && Number(searchParams.get('maxPrice'))}
              onChange={setRange}
            />
          )
        }

        const Control = CONTROLS[filter.type]
        if (!Control) return null

        return (
          <Control
            key={filter.key}
            filter={filter}
            selected={readList(searchParams, filter.key)}
            onChange={(values) => setList(filter.key, values)}
          />
        )
      })}
    </aside>
  )
}
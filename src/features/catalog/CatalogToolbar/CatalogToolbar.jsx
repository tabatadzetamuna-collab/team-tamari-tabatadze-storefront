import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SORT_OPTIONS, withParam } from '../catalogParams'
import { SearchIcon } from '../../../shared/ui/icons/icons'
import './CatalogToolbar.css'

export default function CatalogToolbar({ total }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [draft, setDraft] = useState(null)
  const timer = useRef(null)
  const query = draft ?? searchParams.get('q') ?? ''

  function handleSearch(e) {
    const value = e.target.value
    setDraft(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setSearchParams((prev) => withParam(prev, 'q', value.trim()))
      setDraft(null)
    }, 400)
  }

  function handleSort(e) {
    const value = e.target.value
    setSearchParams(withParam(searchParams, 'sort', value === 'newest' ? '' : value))
  }

  return (
    <div className="catalog-toolbar">
      <label className="catalog-toolbar__search">
        <SearchIcon />
        <span className="visually-hidden">ძებნა</span>
        <input
          type="search"
          placeholder="მოძებნე ტელეფონი..."
          value={query}
          onChange={handleSearch}
        />
      </label>

      <label className="catalog-toolbar__sort">
        <span className="catalog-toolbar__sort-label">დალაგება</span>
        <select value={searchParams.get('sort') ?? 'newest'} onChange={handleSort}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

            <p className="catalog-toolbar__count">{total != null ? `${total} პროდუქტი` : ''}</p>
    </div>
  )
}
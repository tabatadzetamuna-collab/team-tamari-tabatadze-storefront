import './Pagination.css'

function getPages(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('…')
  pages.push(totalPages)
  return pages
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="გვერდები">
      <button
        type="button"
        className="pagination__button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        წინა
      </button>

      <ul className="pagination__list">
        {getPages(page, totalPages).map((item, index) =>
          item === '…' ? (
            <li key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className="pagination__button"
                aria-current={item === page ? 'page' : undefined}
                aria-label={`გვერდი ${item}`}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="pagination__button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        შემდეგი
      </button>
    </nav>
  )
}
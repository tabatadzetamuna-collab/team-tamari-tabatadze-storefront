import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ProductGallery.css'

export default function ProductGallery({ images, title }) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const total = images.length

  return (
    <div className="product-gallery">
      <img
        src={images[active]}
        alt={t('product.imageAlt', { title, index: active + 1, total })}
        className="product-gallery__main"
          fetchPriority="high"
        />

      {total > 1 && (
        <ul className="product-gallery__thumbs">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                className="product-gallery__thumb"
                aria-label={t('product.imageAlt', { title, index: index + 1, total })}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => setActive(index)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
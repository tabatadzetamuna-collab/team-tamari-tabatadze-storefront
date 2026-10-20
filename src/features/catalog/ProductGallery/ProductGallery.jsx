import { useState } from 'react'
import './ProductGallery.css'

export default function ProductGallery({ images, title }) {
  const [active, setActive] = useState(0)
  const total = images.length

  return (
    <div className="product-gallery">
      <img
        src={images[active]}
        alt={`${title} — სურათი ${active + 1} / ${total}`}
        className="product-gallery__main"
      />

      {total > 1 && (
        <ul className="product-gallery__thumbs">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                className="product-gallery__thumb"
                aria-label={`${title} — სურათი ${index + 1} / ${total}`}
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
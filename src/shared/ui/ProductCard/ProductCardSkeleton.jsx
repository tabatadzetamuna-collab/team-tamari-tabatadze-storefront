import './ProductCard.css'

export default function ProductCardSkeleton() {
  return (
    <div className="product-card" aria-hidden="true">
      <div className="skeleton product-card__image" />
      <div className="skeleton skeleton--text skeleton--short" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text skeleton--short" />
    </div>
  )
}
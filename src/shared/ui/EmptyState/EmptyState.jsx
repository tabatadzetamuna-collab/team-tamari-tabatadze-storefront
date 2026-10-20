import Button from '../Button/Button'
import './EmptyState.css'

export default function EmptyState({ title, children, actionLabel, onAction, role = 'status' }) {
  return (
    <div className="empty-state" role={role}>
      <p className="empty-state__title">{title}</p>
      {children && <p className="empty-state__text">{children}</p>}
      {actionLabel && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
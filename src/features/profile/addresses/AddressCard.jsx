import { EditIcon, TrashIcon } from '../../../shared/ui/icons/icons'
import { useTranslation } from 'react-i18next'
import './addresses.css'

export default function AddressCard({ address, busy, onEdit, onDelete, onMakeDefault }) {
  const { t } = useTranslation()
  const { label, fullName, phone, city, address: street, isDefault } = address
  const name = label || street

  return (
    <article className="address-card">
      <div className="address-card__head">
        {isDefault ? (
          <span className="address-card__badge">{t('addresses.default')}</span>
        ) : (
          <button
            type="button"
            className="address-card__make-default"
            disabled={busy}
            onClick={onMakeDefault}
          >
            <span className="address-card__radio" aria-hidden="true" />
            {t('addresses.makeDefault')}
          </button>
        )}

        <div className="address-card__actions">
          <button
            type="button"
            className="address-card__icon"
            aria-label={t('addresses.edit', { name })}
            onClick={onEdit}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="address-card__icon"
            aria-label={t('addresses.delete', { name })}
            disabled={busy}
            onClick={onDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="address-card__body">
        {label && <p className="address-card__label">{label}</p>}
        <p className="address-card__name">{fullName}</p>
        <p>{city}, {street}</p>
        <p>{t('checkout.phoneValue', { phone })}</p>
      </div>
    </article>
  )
}
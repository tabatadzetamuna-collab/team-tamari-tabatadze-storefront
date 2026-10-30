import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddressCard from '../../features/profile/addresses/AddressCard'
import AddressForm from '../../features/profile/addresses/AddressForm'
import { useAddresses, useAddressMutations } from '../../features/profile/addresses/useAddresses'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { describeError } from '../../shared/lib/mapServerErrors'
import { MAX_ADDRESSES } from '../../config'
import './AddressesPage.css'
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle'

export default function AddressesPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('addresses.title'))
  const { data, isPending, isError, refetch } = useAddresses()
  const { create, update, remove } = useAddressMutations()
  const [editing, setEditing] = useState(null)
  const [notice, setNotice] = useState(null)

  const items = data?.items ?? []
  const limitReached = items.length >= MAX_ADDRESSES
  const busy = update.isPending || remove.isPending

  function startAdding() {
    setNotice(null)
    setEditing('new')
  }

  async function handleDelete(address) {
    const name = address.label || address.address
    if (!window.confirm(t('addresses.confirmDelete', { name }))) return
    setNotice(null)
    try {
      await remove.mutateAsync(address.id)
    } catch (error) {
      setNotice(error.code === 'ADDRESS_NOT_FOUND' ? t('addresses.alreadyDeleted') : describeError(error))
    }
  }

  async function handleMakeDefault(address) {
    setNotice(null)
    try {
      await update.mutateAsync({ id: address.id, body: { isDefault: true } })
    } catch (error) {
      setNotice(error.code === 'ADDRESS_NOT_FOUND' ? t('addresses.alreadyDeleted') : describeError(error))
    }
  }

  function renderList() {
    if (isPending) {
      return (
        <div className="addresses-page__list" aria-busy="true">
          <div className="skeleton addresses-page__skeleton" />
          <div className="skeleton addresses-page__skeleton" />
        </div>
      )
    }

    if (isError) {
      return (
        <EmptyState
          role="alert"
          title={t('common.loadFailed')}
          actionLabel={t('common.retry')}
          onAction={() => refetch()}
        />
      )
    }

    if (items.length === 0 && editing !== 'new') {
      return (
        <EmptyState title={t('addresses.empty')} actionLabel={t('addresses.add')} onAction={startAdding} />
      )
    }

    return (
      <ul className="addresses-page__list">
        {items.map((address) => (
          <li key={address.id}>
            {editing === address.id ? (
              <AddressForm
                address={address}
                onCancel={() => setEditing(null)}
                onSave={async (body) => {
                  await update.mutateAsync({ id: address.id, body })
                  setEditing(null)
                }}
              />
            ) : (
              <AddressCard
                address={address}
                busy={busy}
                onEdit={() => setEditing(address.id)}
                onDelete={() => handleDelete(address)}
                onMakeDefault={() => handleMakeDefault(address)}
              />
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="addresses-page">
      <div className="addresses-page__head">
        <h1 className="addresses-page__title">{t('addresses.title')}</h1>
        <Button onClick={startAdding} disabled={limitReached || editing === 'new' || isPending}>
          {t('addresses.add')}
        </Button>
      </div>

      {limitReached && <p className="addresses-page__hint">{t('addresses.limit')}</p>}

      {notice && <Alert variant="error">{notice}</Alert>}

      {editing === 'new' && (
        <AddressForm
          onCancel={() => setEditing(null)}
          onSave={async (body) => {
            await create.mutateAsync(body)
            setEditing(null)
          }}
        />
      )}

      {renderList()}
    </section>
  )
}
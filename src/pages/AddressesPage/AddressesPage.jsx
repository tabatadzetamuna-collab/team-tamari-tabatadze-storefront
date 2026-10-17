import { useState } from 'react'
import AddressCard from '../../features/profile/addresses/AddressCard'
import AddressForm from '../../features/profile/addresses/AddressForm'
import { useAddresses, useAddressMutations } from '../../features/profile/addresses/useAddresses'
import Button from '../../shared/ui/Button/Button'
import Alert from '../../shared/ui/Alert/Alert'
import EmptyState from '../../shared/ui/EmptyState/EmptyState'
import { describeError } from '../../shared/lib/mapServerErrors'
import { MAX_ADDRESSES } from '../../config'
import './AddressesPage.css'

export default function AddressesPage() {
  const { data, isPending, isError, refetch } = useAddresses()
  const { create, update, remove } = useAddressMutations()
  const [editing, setEditing] = useState(null) // 'new' | მისამართის id | null
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
    if (!window.confirm(`წაიშალოს „${name}"?`)) return
    setNotice(null)
    try {
      await remove.mutateAsync(address.id)
    } catch (error) {
      setNotice(error.code === 'ADDRESS_NOT_FOUND' ? 'ეს მისამართი უკვე წაშლილია' : describeError(error))
    }
  }

  async function handleMakeDefault(address) {
    setNotice(null)
    try {
      await update.mutateAsync({ id: address.id, body: { isDefault: true } })
    } catch (error) {
      setNotice(error.code === 'ADDRESS_NOT_FOUND' ? 'ეს მისამართი უკვე წაშლილია' : describeError(error))
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
        <EmptyState role="alert" title="ვერ ჩაიტვირთა" actionLabel="ხელახლა ცდა" onAction={() => refetch()} />
      )
    }

    if (items.length === 0 && editing !== 'new') {
      return (
        <EmptyState
          title="შენახული მისამართი არ გაქვს"
          actionLabel="მისამართის დამატება"
          onAction={startAdding}
        />
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
        <h1 className="addresses-page__title">მისამართები</h1>
        <Button onClick={startAdding} disabled={limitReached || editing === 'new' || isPending}>
          მისამართის დამატება
        </Button>
      </div>

      {limitReached && (
        <p className="addresses-page__hint">მაქსიმუმ {MAX_ADDRESSES} მისამართის შენახვა შეიძლება</p>
      )}

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
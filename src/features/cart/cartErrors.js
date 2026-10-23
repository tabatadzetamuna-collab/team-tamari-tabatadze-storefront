import { describeError } from '../../shared/lib/mapServerErrors'
import i18n from '../../i18n'

export function cartErrorText(error) {
  if (error.code === 'INSUFFICIENT_STOCK') {
    const available = error.data?.available
    if (available === 0) return i18n.t('cart.errors.outOfStock')
    if (Number.isInteger(available) && available > 0) return i18n.t('cart.errors.onlyLeft', { count: available })
    return i18n.t('cart.errors.insufficient')
  }
  if (error.code === 'OUT_OF_STOCK') return i18n.t('cart.errors.outOfStock')
  if (error.code === 'PRODUCT_NOT_FOUND') return i18n.t('cart.errors.notFound')
  return describeError(error)
}
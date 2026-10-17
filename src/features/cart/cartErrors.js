import { describeError } from '../../shared/lib/mapServerErrors'

export function cartErrorText(error) {
  if (error.code === 'INSUFFICIENT_STOCK') return `მარაგში მხოლოდ ${error.data?.available ?? 0} ცალია`
  if (error.code === 'OUT_OF_STOCK') return 'ამოწურულია'
  if (error.code === 'PRODUCT_NOT_FOUND') return 'პროდუქტი აღარ არსებობს'
  return describeError(error)
}
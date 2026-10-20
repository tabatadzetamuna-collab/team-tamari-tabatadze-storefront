import { describeError } from '../../shared/lib/mapServerErrors'

export function cartErrorText(error) {
  if (error.code === 'INSUFFICIENT_STOCK') {
    const available = error.data?.available
    if (available === 0) return 'ამოწურულია'
    if (Number.isInteger(available) && available > 0) return `მარაგში მხოლოდ ${available} ცალია`
    return 'მარაგი არ კმარა'
  }
  if (error.code === 'OUT_OF_STOCK') return 'ამოწურულია'
  if (error.code === 'PRODUCT_NOT_FOUND') return 'პროდუქტი აღარ არსებობს'
  return describeError(error)
}
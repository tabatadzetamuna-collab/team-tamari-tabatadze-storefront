import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartService } from '../../shared/services/cartService'
import { useSession } from '../../session/useSession'

export function useCart() {
  const { status, user } = useSession()
  return useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => cartService.get(),
    enabled: status === 'signedIn',
  })
}

const CART_SCOPE = { id: 'cart' }

export function useCartMutations() {
  const queryClient = useQueryClient()
  const { user } = useSession()
  const key = ['cart', user?.id]

  const apply = (cart) => {
    if (cart?.items) queryClient.setQueryData(key, cart)
    else queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  const add = useMutation({
    scope: CART_SCOPE,
    mutationFn: ({ productId, qty }) => cartService.add(productId, qty),
    onSuccess: apply,
  })

  const update = useMutation({
    scope: CART_SCOPE,
    mutationFn: ({ itemId, qty }) => cartService.update(itemId, qty),
    onSuccess: apply,
  })

  const remove = useMutation({
    scope: CART_SCOPE,
    mutationFn: ({ itemId }) => cartService.remove(itemId),
    onSuccess: apply,
  })

  return { add, update, remove }
}
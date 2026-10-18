import { useQuery } from '@tanstack/react-query'
import { orderService } from '../../shared/services/orderService'
import { useSession } from '../../session/useSession'

export function useCheckout() {
  const { user } = useSession()
  return useQuery({
    queryKey: ['checkout', user?.id],
    queryFn: () => orderService.getCheckout(),
    staleTime: 0,
  })
}
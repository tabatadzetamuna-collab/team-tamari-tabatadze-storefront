import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addressService } from '../../../shared/services/addressService'
import { useSession } from '../../../session/useSession'

export function useAddresses() {
  const { user } = useSession()
  return useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => addressService.list(),
  })
}

export function useAddressMutations() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['addresses'] })

  const onError = (error) => {
    if (error.code === 'ADDRESS_NOT_FOUND') refresh()
  }

  const create = useMutation({
    mutationFn: (body) => addressService.create(body),
    onSuccess: refresh,
  })

  const update = useMutation({
    mutationFn: ({ id, body }) => addressService.update(id, body),
    onSuccess: refresh,
    onError,
  })

  const remove = useMutation({
    mutationFn: (id) => addressService.remove(id),
    onSuccess: refresh,
    onError,
  })

  return { create, update, remove }
}
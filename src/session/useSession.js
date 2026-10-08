import { useContext } from 'react'
import { SessionContext } from './SessionContext'

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('useSession უნდა იყოს SessionProvider-ის შიგნით')
  return session
}
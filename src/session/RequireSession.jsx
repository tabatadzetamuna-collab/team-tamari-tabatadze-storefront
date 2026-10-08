import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from './useSession'
import ScreenLoader from '../shared/ui/ScreenLoader/ScreenLoader'

export default function RequireSession({ children }) {
  const { status } = useSession()
  const location = useLocation()

  if (status === 'checking') return <ScreenLoader />
  if (status === 'signedOut') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
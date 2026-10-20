import { useCallback, useEffect, useMemo, useState } from 'react'
import { SessionContext } from './SessionContext'
import { authService } from '../shared/services/authService'
import { onSessionExpired } from '../shared/services/httpClient'
import { readToken, saveToken, clearToken } from '../shared/services/tokenStorage'

export default function SessionProvider({ children }) {
  const [status, setStatus] = useState(() => (readToken() ? 'checking' : 'signedOut'))
  const [user, setUser] = useState(null)
  const [expiredNotice, setExpiredNotice] = useState(false)

  useEffect(() => {
    if (!readToken()) return
    let ignore = false

    authService
      .getCurrentUser()
      .then((data) => {
        if (ignore) return
        setUser(data.user)
        setStatus('signedIn')
      })
      .catch((error) => {
        if (ignore) return
        if (error.status === 401) clearToken()
        setUser(null)
        setStatus('signedOut')
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    return onSessionExpired(() => {
      setUser(null)
      setStatus('signedOut')
      setExpiredNotice(true)
    })
  }, [])

  const startSession = useCallback((data) => {
    saveToken(data.accessToken)
    setUser(data.user)
    setExpiredNotice(false)
    setStatus('signedIn')
  }, [])

  const signIn = useCallback(
    async (credentials) => startSession(await authService.login(credentials)),
    [startSession]
  )

  const signUp = useCallback(
    async (values) => startSession(await authService.register(values)),
    [startSession]
  )

  const signOut = useCallback(() => {
    authService.logout().catch(() => {})
    clearToken()
    setUser(null)
    setStatus('signedOut')
  }, [])

  const updateUser = useCallback((nextUser) => setUser(nextUser), [])

  const value = useMemo(
    () => ({ status, user, expiredNotice, signIn, signUp, signOut, updateUser }),
    [status, user, expiredNotice, signIn, signUp, signOut, updateUser]
  )

  return <SessionContext value={value}>{children}</SessionContext>
}
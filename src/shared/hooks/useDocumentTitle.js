import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return
    document.title = `${title} — Cyber`
    return () => {
      document.title = 'Cyber'
    }
  }, [title])
}
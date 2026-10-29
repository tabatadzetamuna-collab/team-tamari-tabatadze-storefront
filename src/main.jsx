import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SessionProvider from './session/SessionProvider'
import './i18n'
import { loadIntlPolyfills } from './i18n/polyfills'
import './styles/tokens.css'
import './styles/global.css'
import App from './App'
import { productQuery } from './features/catalog/useCatalogQueries'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

const productMatch = window.location.pathname.match(/^\/product\/([^/]+)/)
if (productMatch) {
  queryClient.prefetchQuery(productQuery(decodeURIComponent(productMatch[1])))
}
loadIntlPolyfills().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SessionProvider>
            <App />
          </SessionProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
})
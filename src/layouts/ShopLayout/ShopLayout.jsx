import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import ScreenLoader from '../../shared/ui/ScreenLoader/ScreenLoader'
import TopBar from '../../components/TopBar/TopBar'
import './ShopLayout.css'

export default function ShopLayout() {
  return (
    <>
      <TopBar />
      <main className="shop-layout">
        <Suspense fallback={<ScreenLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}
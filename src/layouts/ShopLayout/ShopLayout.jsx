import { Outlet } from 'react-router-dom'
import TopBar from '../../components/TopBar/TopBar'
import './ShopLayout.css'

export default function ShopLayout() {
  return (
    <>
      <TopBar />
      <main className="shop-layout">
        <Outlet />
      </main>
    </>
  )
}
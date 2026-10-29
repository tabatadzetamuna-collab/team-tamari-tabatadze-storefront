import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RequireSession from './session/RequireSession'
import ShopLayout from './layouts/ShopLayout/ShopLayout'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import ScreenLoader from './shared/ui/ScreenLoader/ScreenLoader'

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage/ForgotPasswordPage'))
const ProductPage = lazy(() => import('./pages/ProductPage/ProductPage'))
const ProfileLayout = lazy(() => import('./features/profile/ProfileLayout/ProfileLayout'))
const AccountPage = lazy(() => import('./pages/AccountPage/AccountPage'))
const AddressesPage = lazy(() => import('./pages/AddressesPage/AddressesPage'))
const CartPage = lazy(() => import('./pages/CartPage/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'))
const ConfirmPage = lazy(() => import('./pages/ConfirmPage/ConfirmPage'))
const OrderPage = lazy(() => import('./pages/OrderPage/OrderPage'))

export default function App() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ShopLayout />}>
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
        </Route>

        <Route element={<RequireSession><ShopLayout /></RequireSession>}>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<AccountPage />} />
            <Route path="addresses" element={<AddressesPage />} />
          </Route>

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/confirm/:orderId" element={<ConfirmPage />} />
          <Route path="/orders/:id" element={<OrderPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
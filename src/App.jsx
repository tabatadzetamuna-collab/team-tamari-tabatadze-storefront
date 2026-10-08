import { Routes, Route, Navigate } from 'react-router-dom'
import RequireSession from './session/RequireSession'
import ShopLayout from './layouts/ShopLayout/ShopLayout'
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<RequireSession><ShopLayout /></RequireSession>}>
        <Route path="/" element={<MainPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
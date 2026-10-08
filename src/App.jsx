import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'

export default function App() {
  return (
    <Routes>
      {/* დროებითი შესვლა */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
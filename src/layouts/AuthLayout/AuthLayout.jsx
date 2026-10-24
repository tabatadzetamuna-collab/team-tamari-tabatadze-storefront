import LanguageSwitcher from '../../shared/ui/LanguageSwitcher/LanguageSwitcher'
import './AuthLayout.css'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-layout">
      <div className="auth-layout__lang">
        <LanguageSwitcher />
      </div>

      <div className="auth-layout__card">
        <h1 className="auth-layout__title">{title}</h1>
        {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
        {children}
      </div>
    </main>
  )
}
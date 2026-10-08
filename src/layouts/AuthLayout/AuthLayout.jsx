import './AuthLayout.css'

export default function AuthLayout({ title, children }) {
  return (
    <main className="auth-layout">
      <div className="auth-layout__card">
        <h1 className="auth-layout__title">{title}</h1>
        {children}
      </div>
    </main>
  )
}
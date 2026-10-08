import { useSession } from '../../session/useSession'
import './MainPage.css'

export default function MainPage() {
  const { user } = useSession()

  return (
    <section className="main-page">
      <h1 className="main-page__title">გამარჯობა, {user.name}!</h1>
      <p className="main-page__email">{user.email}</p>
    </section>
  )
}
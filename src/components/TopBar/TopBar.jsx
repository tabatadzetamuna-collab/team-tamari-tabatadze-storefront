import { Link } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import Button from '../../shared/ui/Button/Button'
import './TopBar.css'

export default function TopBar() {
  const { user, signOut } = useSession()

  return (
    <header className="top-bar">
      <Link to="/" className="top-bar__logo">Storefront</Link>

      <div className="top-bar__user">
        <span className="top-bar__name">{user?.name}</span>
        <Button variant="secondary" onClick={signOut}>
          გამოსვლა
        </Button>
      </div>
    </header>
  )
}
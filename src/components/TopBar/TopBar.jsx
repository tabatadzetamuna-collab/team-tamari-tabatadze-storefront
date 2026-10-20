import { Link, NavLink } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import Button from '../../shared/ui/Button/Button'
import { UserIcon } from '../../shared/ui/icons/icons'
import './TopBar.css'

export default function TopBar() {
  const { user, signOut } = useSession()

  return (
    <header className="top-bar">
      <div className="top-bar__left">
        <Link to="/" className="top-bar__logo" aria-label="მთავარი გვერდი">
          <img src="/images/logo.svg" alt="" className="top-bar__logo-img" />
        </Link>

        <nav aria-label="მთავარი მენიუ">
          <ul className="top-bar__nav">
            <li>
              <NavLink to="/" end className="top-bar__nav-link">
                მთავარი
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalog" className="top-bar__nav-link">
                მაღაზია
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

            <div className="top-bar__user">
              {user ? (
                <>
                <span className="top-bar__name">
                 <UserIcon />
                  {user.name}
                </span>
                <Button variant="outline" onClick={signOut}>
                  გამოსვლა
                </Button>
                </>
            ) : (
                <Link to="/login" className="button button--outline">
                  შესვლა
                </Link>
               )}
              </div>
    </header>
  )
}
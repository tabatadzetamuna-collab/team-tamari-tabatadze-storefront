import { Link, NavLink } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import { useCart } from '../../features/cart/useCart'
import Button from '../../shared/ui/Button/Button'
import { UserIcon, CartIcon } from '../../shared/ui/icons/icons'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher/LanguageSwitcher'
import './TopBar.css'

export default function TopBar() {
  const { user, signOut } = useSession()
  const { data: cart } = useCart()
  const count = cart?.totalQty ?? 0

  return (
    <header className="top-bar">
      <div className="top-bar__left">
        <Link to="/" className="top-bar__logo" aria-label="მთავარი გვერდი">
          <img src="/images/logo.svg" alt="" className="top-bar__logo-img" />
        </Link>

        <nav aria-label="მთავარი მენიუ">
          <ul className="top-bar__nav">

            <li>
              <NavLink to="/catalog" className="top-bar__nav-link">
                მაღაზია
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="top-bar__user">
         <LanguageSwitcher />
        <Link to="/cart" className="top-bar__cart" aria-label={`კალათა, ${count} ნივთი`}>
          <CartIcon />
          {count > 0 && (
            <span className="top-bar__badge" aria-hidden="true">
              {count}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="top-bar__name">
              <UserIcon />
              {user.name}
            </Link>
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
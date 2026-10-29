import { Link, NavLink } from 'react-router-dom'
import { useSession } from '../../session/useSession'
import { useCart } from '../../features/cart/useCart'
import Button from '../../shared/ui/Button/Button'
import { UserIcon, CartIcon } from '../../shared/ui/icons/icons'
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import './TopBar.css'

export default function TopBar() {
  const { t } = useTranslation()
  const { user, signOut } = useSession()
  const { data: cart } = useCart()
  const count = cart?.totalQty ?? 0

  return (
    <header className="top-bar">
      <div className="top-bar__left">
        <Link to="/" className="top-bar__logo" aria-label={t('nav.homePage')}>
          <img src="/images/logo.svg" alt="" width="75" height="56" className="top-bar__logo-img" />
        </Link>

        <nav aria-label={t('nav.mainMenu')}>
          <ul className="top-bar__nav">

            <li>
              <NavLink to="/catalog" className="top-bar__nav-link">
                {t('nav.store')}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="top-bar__user">
         <LanguageSwitcher />
        <Link to="/cart" className="top-bar__cart" aria-label={t('header.cart', { count })}>
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
              {t('header.logout')}
            </Button>
          </>
        ) : (
          <Link to="/login" className="button button--outline">
            {t('header.login')}
          </Link>
        )}
      </div>
    </header>
  )
}
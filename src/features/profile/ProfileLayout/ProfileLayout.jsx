import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../session/useSession'
import { UserIcon, MapPinIcon, LogoutIcon } from '../../../shared/ui/icons/icons'
import './ProfileLayout.css'

export default function ProfileLayout() {
  const { t } = useTranslation()
  const { signOut } = useSession()
  const { pathname } = useLocation()
  const current = pathname.endsWith('/addresses') ? t('profile.addresses') : t('profile.account')

  return (
    <div className="profile-layout">
      <nav className="profile-layout__breadcrumb" aria-label={t('product.breadcrumb')}>
        <Link to="/">{t('product.home')}</Link> / <span>{t('profile.title')}</span> / <span>{current}</span>
      </nav>

      <div className="profile-layout__body">
        <nav className="profile-nav" aria-label={t('profile.menu')}>
          <NavLink to="/profile" end className="profile-nav__link">
            <UserIcon /> {t('profile.account')}
          </NavLink>
          <NavLink to="/profile/addresses" className="profile-nav__link">
            <MapPinIcon /> {t('profile.addresses')}
          </NavLink>
          <button type="button" className="profile-nav__link" onClick={signOut}>
            <LogoutIcon /> {t('header.logout')}
          </button>
        </nav>

        <div className="profile-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../../../session/useSession'
import { UserIcon, MapPinIcon, LogoutIcon } from '../../../shared/ui/icons/icons'
import './ProfileLayout.css'

export default function ProfileLayout() {
  const { signOut } = useSession()
  const { pathname } = useLocation()
  const current = pathname.endsWith('/addresses') ? 'მისამართები' : 'ანგარიში'

  return (
    <div className="profile-layout">
      <nav className="profile-layout__breadcrumb" aria-label="ნავიგაცია">
        <Link to="/">მთავარი</Link> / <span>პროფილი</span> / <span>{current}</span>
      </nav>

      <div className="profile-layout__body">
        <nav className="profile-nav" aria-label="პროფილის მენიუ">
          <NavLink to="/profile" end className="profile-nav__link">
            <UserIcon /> ანგარიში
          </NavLink>
          <NavLink to="/profile/addresses" className="profile-nav__link">
            <MapPinIcon /> მისამართები
          </NavLink>
          <button type="button" className="profile-nav__link" onClick={signOut}>
            <LogoutIcon /> გამოსვლა
          </button>
        </nav>

        <div className="profile-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
import { useSession } from '../../session/useSession'
import './MainPage.css'

export default function MainPage() {
  const { user } = useSession()
  const initial = user.name?.charAt(0).toUpperCase()

  return (
    <section className="main-page">
      <h1 className="main-page__title">გამარჯობა, {user.name}!</h1>
      <p className="main-page__text">შესვლა წარმატებით დასრულდა.</p>

      <article className="info-card">
        <h2 className="info-card__header">ანგარიშის ინფორმაცია</h2>

        <div className="info-card__body">
          <div className="info-card__person">
            <span className="info-card__avatar" aria-hidden="true">{initial}</span>
            <p className="info-card__name">{user.name}</p>
          </div>

          <p className="info-card__row">
            <span className="info-card__label">ელფოსტა:</span> {user.email}
          </p>
        </div>
      </article>
    </section>
  )
}
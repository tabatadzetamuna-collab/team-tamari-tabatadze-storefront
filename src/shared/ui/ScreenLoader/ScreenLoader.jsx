import { useTranslation } from 'react-i18next'
import './ScreenLoader.css'

export default function ScreenLoader() {
  const { t } = useTranslation()
  return (
    <div className="screen-loader" role="status">
      {t('auth.loading')}
    </div>
  )
}
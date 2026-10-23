import { useTranslation } from 'react-i18next'
import './SpecsTable.css'

export default function SpecsTable({ specs }) {
  const { t } = useTranslation()
  return (
    <table className="specs-table">
      <caption className="visually-hidden">{t('product.specs')}</caption>
      <tbody>
        {Object.entries(specs).map(([name, value]) => (
          <tr key={name}>
            <th scope="row">{name}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
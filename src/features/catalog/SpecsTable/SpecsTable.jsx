import './SpecsTable.css'

export default function SpecsTable({ specs }) {
  return (
    <table className="specs-table">
      <caption className="visually-hidden">მახასიათებლები</caption>
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
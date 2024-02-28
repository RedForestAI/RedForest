export type ColumnType = {
  title: string
}

type TableProps = {
  columns: ColumnType[]
  tableData: any[]
}

export default function Table(props: TableProps) {
  return (
  <div className="">
    <table className="table table-xs table-pin-rows table-pin-cols">
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" className="checkbox checkbox-sm" />
            </label>
          </th>
          {props.columns.map((column, index) => {
            return <th key={index}>{column.title}</th>
          })}
        </tr>
      </thead>

      {/* Add a divider line */}
      <tbody>
        <tr>
          <td colSpan={props.columns.length + 1}>
            <hr />
          </td>
        </tr>
      </tbody>

      <tbody>
        {props.tableData.map((row, index) => {
          return (
            <tr key={index}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </label>
              </th>
              {row.map((data: any, index: number) => {
                return <td key={index}>{data}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
  )
}
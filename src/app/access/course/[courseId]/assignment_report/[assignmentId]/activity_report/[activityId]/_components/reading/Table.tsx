import { useState, useEffect } from 'react'

export type ColumnType = {
  title: string
}

type TableProps = {
  columns: ColumnType[]
  tableData: any[],
  selectedId: string[]
  setSelectedId: (selected: string[]) => void
}

export default function Table(props: TableProps) {
  const [selectAll, setSelectAll] = useState<boolean>(false)

  useEffect(() => {
    if (props.selectedId.length === props.tableData.length) {
      setSelectAll(true)
    }
    else {
      setSelectAll(false)
    }
  }, [props.selectedId])

  function changeSelect(e: any, id: string) {
    const checked = e.target.checked
    if (checked) {
      props.setSelectedId([...props.selectedId, id])
    } else {
      props.setSelectedId(props.selectedId.filter((selectedId) => selectedId !== id))
    }

  }

  function changeAll(e: any) {
    const checked = e.target.checked
    if (checked) {
      setSelectAll(true)
      props.setSelectedId(props.tableData.map((row) => row[0]))
    } else {
      setSelectAll(false)
      props.setSelectedId([])
    }
  }
  
  return (
  <div className="">
    <table className="table table-zebra table-sm table-pin-rows table-pin-cols">
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" className="checkbox checkbox-sm" checked={selectAll} onChange={changeAll}/>
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
                  <input type="checkbox" className="checkbox checkbox-sm" checked={props.selectedId.includes(row[0])} onChange={(e) => {changeSelect(e, row[0])}}/>
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
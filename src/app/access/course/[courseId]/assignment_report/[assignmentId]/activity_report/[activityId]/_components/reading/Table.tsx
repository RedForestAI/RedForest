import { useState, useEffect } from 'react'
import { colorMap } from '../types'
import Tooltip from './Tooltip'

export type ColumnType = {
  title: string,
  hoverHint?: string
}

type TableProps = {
  colors: colorMap
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
            <th>
            </th>
            {props.columns.map((column, index) => {
              return (
                <Tooltip text={column.title} content={column.hoverHint} />
              )
            })}
          </tr>
        </thead>

        {/* Add a divider line */}
        <tbody>
          <tr>
            <td colSpan={props.columns.length + 2}>
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
                <th style={{position: "relative"}}>
                  <label style={{display: "block", height: "100%"}}>
                    <div className="overflow-hidden rounded-2xl mt-2 mb-2" style={{position: "absolute", top: 0, bottom: 0, left: 0, width: "0.5vw", backgroundColor: `${props.colors[row[0]]}`}}>
                    </div>
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
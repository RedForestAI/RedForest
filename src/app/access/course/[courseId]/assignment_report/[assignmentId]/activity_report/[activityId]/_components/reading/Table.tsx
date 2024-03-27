import { useState, useEffect } from "react";
import { colorMap } from "../types";
import Tooltip from "./Tooltip";

export type Column = {
  title: string;
  hoverHint?: string;
};

export type Ceil = {
  data: any;
  type?: string;
};

type TableProps = {
  colors: colorMap;
  columns: Column[];
  tableData: any[];
  setTableData: (data: any[]) => void;
  selectedId: string[];
  setSelectedId: (selected: string[]) => void;
};

export default function Table(props: TableProps) {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<string>("asc"); // or 'desc'
  const [sortedColumn, setSortedColumn] = useState<number>(0);

  useEffect(() => {
    if (props.selectedId.length === props.tableData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [props.selectedId]);

  function sortTable(columnIndex: number) {
    const sortedData = [...props.tableData].sort((a, b) => {
      const valueA = a[columnIndex].data; // Adjust based on your data structure
      const valueB = b[columnIndex].data;

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    props.setTableData(sortedData); // Assuming you have a method to update the original data
    setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle the direction
    setSortedColumn(columnIndex);
  }

  function changeSelect(e: any, id: string) {
    const checked = e.target.checked;
    if (checked) {
      props.setSelectedId([...props.selectedId, id]);
    } else {
      props.setSelectedId(
        props.selectedId.filter((selectedId) => selectedId !== id),
      );
    }
  }

  function changeAll(e: any) {
    const checked = e.target.checked;
    if (checked) {
      setSelectAll(true);
      props.setSelectedId(props.tableData.map((row) => row[0].data));
    } else {
      setSelectAll(false);
      props.setSelectedId([]);
    }
  }

  return (
    <div className="">
      <table className="table table-zebra table-pin-rows table-pin-cols table-sm">

        {/* Selection Buttons */}
        <thead>
          <tr>
            <th></th>
            <th></th>
            {props.columns.map((column, index) => {
              if (column.title[0] == "Q" || column.title == "Coldread") {
                return <th><input type="radio" name="time-selection-radio" className="radio"/></th>
              } else {
                return <th></th>;
              }
            })}
          </tr>
        </thead>

        {/* Table header */}
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectAll}
                  onChange={changeAll}
                />
              </label>
            </th>
            <th></th>
            {props.columns.map((column, index) => {
              return (
                <Tooltip
                  key={index}
                  index={index}
                  onClickHandler={(e: any, index: number) => sortTable(index)}
                  text={column.title}
                  content={column.hoverHint}
                  sortedColumn={sortedColumn}
                  sortDirection={sortDirection}
                />
              );
            })}
          </tr>
        </thead>

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
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={props.selectedId.includes(row[0].data)}
                      onChange={(e) => {
                        changeSelect(e, row[0].data);
                      }}
                    />
                  </label>
                </th>
                <th>
                  <label>
                    <div
                      className="w-[1vw] pt-[1.5vh] pb-[1.5vh] overflow-hidden rounded-2xl"
                      style={{
                        textAlign: "center",
                        backgroundColor: `${props.colors[row[0].data]}`,
                      }}
                    ></div>
                  </label>
                </th>
                {row.map((ceil: Ceil, index: number) => {
                  switch (ceil.type) {
                    case "DEFAULT":
                      return <td key={index}>{ceil.data}</td>;
                    case "BOOLEAN":
                      return <td key={index}>{ceil.data ? "✅" : "❌"}</td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

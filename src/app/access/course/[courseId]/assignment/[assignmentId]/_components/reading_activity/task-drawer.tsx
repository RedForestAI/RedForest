import { useState } from 'react'


export default function TaskDrawer() {
  const [open, setOpen] = useState(true)

  function openDrawer() {
    setOpen(!open)
  }

  return (
    <div className={`h-screen bg-base-300 w-1/4 fixed top-0 right-0 border-l border-t z-10 transition ease-in-out duration-300 ${open ? "translate-x-[24rem]" : ""}`}>
        <button className="h-screen border-r w-6 cursor-pointer" onClick={openDrawer}>{open ? "+" : "-"}</button>
    </div>
  )
}
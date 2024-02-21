import { useState } from 'react'

export default function TaskDrawer(props: {children?: React.ReactNode}) {
  const [open, setOpen] = useState(true)

  function openDrawer() {
    setOpen(!open)
  }

  return (
    <div className={`min-h-screen bg-base-300 w-1/4 fixed top-0 right-0 border-l z-50 transition ease-in-out duration-300 ${open ? "translate-x-[23vw]" : ""}`}>
        <div className="flex flex-row w-full">
          <button className="bg-base-200 min-h-screen border-r w-6 cursor-pointer w-[2vw]" onClick={openDrawer}>
            <div className="w-full -rotate-90 whitespace-nowrap text-primary">
              TASK TRAY
            </div>
          </button>
          {props.children}
        </div>
    </div>
  )
}

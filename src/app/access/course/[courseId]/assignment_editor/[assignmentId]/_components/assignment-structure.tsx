import { ActivityCard, EmptyActivityCard } from "./activity-card"
import { Reorder } from 'framer-motion'
import { useState } from 'react'
import { faBook } from "@fortawesome/free-solid-svg-icons"


export default function AssignmentStructure() {
  const [items, setItems] = useState([1, 2, 3])
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Structure</h2>
        <div>
          <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map((item) => (
              <Reorder.Item key={item} value={item}>
                <ActivityCard icon={faBook}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyActivityCard/>
        </div>
      </div>
    </div>
  )
}
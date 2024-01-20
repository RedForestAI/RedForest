import { Activity } from '@prisma/client'
import { ActivityCard, EmptyActivityCard } from "./activity-card"
import { Reorder } from 'framer-motion'
import { useState } from 'react'
import { faBook } from "@fortawesome/free-solid-svg-icons"

type StructureProps = {
  activities: Activity[]
  setActivities: any
}

export default function AssignmentStructure(props: StructureProps) {
  // const [items, setItems] = useState<Activity[]>(props.activities)
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Structure</h2>
        <div>
          <Reorder.Group axis="y" values={props.activities} onReorder={props.setActivities}>
            {props.activities.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <ActivityCard activity={item} icon={faBook}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyActivityCard/>
        </div>
      </div>
    </div>
  )
}
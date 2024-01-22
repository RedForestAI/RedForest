import { Activity, Assignment } from '@prisma/client'
import { ActivityCard, EmptyActivityCard } from "./activity-card"
import { Reorder } from 'framer-motion'
import { faBook } from "@fortawesome/free-solid-svg-icons"

type StructureProps = {
  assignment: Assignment
  activities: Activity[]
  setActivities: any
}

export default function AssignmentStructure(props: StructureProps) {
  return (
    <div className="card w-full bg-base-100 shadow-xl border-[2px]">
      <div className="card-body">
        <h2 className="card-title">Structure</h2>
        <div>
          <Reorder.Group axis="y" values={props.activities} onReorder={props.setActivities}>
            {props.activities.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <ActivityCard assignment={props.assignment} activity={item} icon={faBook}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyActivityCard assignmentId={props.assignment.id} activities={props.activities} setActivities={props.setActivities}/>
        </div>
      </div>
    </div>
  )
}
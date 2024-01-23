import { Activity, Assignment, Question } from '@prisma/client'
import { ActivityCard, EmptyActivityCard } from "./activity-card"
import { Reorder } from 'framer-motion'
import { faBook } from "@fortawesome/free-solid-svg-icons"

type StructureProps = {
  assignment: Assignment
  activities: Activity[]
  setActivities: any
  questions: Question[][]
  setQuestions: any
}

export default function AssignmentStructure(props: StructureProps) {
  return (
    <div className="card w-full bg-base-100 shadow-xl border-[2px]">
      <div className="card-body">
        <h2 className="card-title">Structure</h2>
        <div>
          <Reorder.Group axis="y" values={props.activities} onReorder={props.setActivities}>
            {props.activities.map((item, index) => (
              <Reorder.Item key={item.id} value={item}>
                <ActivityCard assignment={props.assignment} questions={props.questions[index]!} activity={item} icon={faBook}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyActivityCard assignmentId={props.assignment.id} activities={props.activities} setActivities={props.setActivities} questions={props.questions} setQuestions={props.setQuestions}/>
        </div>
      </div>
    </div>
  )
}
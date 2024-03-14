import { Activity, Assignment, Question } from '@prisma/client'
import { ActivityCard, EmptyActivityCard } from "./ActivityCard"
import { Reorder } from 'framer-motion'

type StructureProps = {
  assignment: Assignment
  activities: Activity[]
  setActivities: any
  questions: Question[][]
  setQuestions: any
  saveFunction: any
}

export default function AssignmentStructure(props: StructureProps) {
  return (
    <div className="card w-full bg-base-100 border border-neutral">
      <div className="card-body">
        <h2 className="card-title">Structure</h2>
        <div>
          <Reorder.Group axis="y" values={props.activities} onReorder={props.setActivities}>
            {props.activities.map((item, index) => (
              <Reorder.Item key={item.id} value={item}>
                <ActivityCard assignment={props.assignment} questions={props.questions[index]!} activity={item} saveFunction={props.saveFunction}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyActivityCard assignmentId={props.assignment.id} activities={props.activities} setActivities={props.setActivities} questions={props.questions} setQuestions={props.setQuestions}/>
        </div>
      </div>
    </div>
  )
}
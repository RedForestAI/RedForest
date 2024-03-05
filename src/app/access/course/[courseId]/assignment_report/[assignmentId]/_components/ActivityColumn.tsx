"use client";

import { Activity, Assignment, Question, ActivityType } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from "next/navigation";
import { getIcon } from "~/utils/icons"
import Link from "next/link";

type ActivityColumnProps = {
  courseId: string
  assignment: Assignment
  activities: Activity[]
  questions: Question[][]
}

export default function ActivityColumn(props: ActivityColumnProps) {

  const releventActivities = props.activities.filter((activity) => activity.type !== ActivityType.READING_BEHAVIOR)

  return (
    <div className="card w-full bg-base-100 border border-neutral">
      <div className="card-body">
        <h2 className="card-title">Activity Reports</h2>
        <div>
            {releventActivities.map((item, index) => (
              <Link href={`/access/course/${props.courseId}/assignment_report/${props.assignment.id}/activity_report/${item.id}`}>
                <ActivityCard key={item.id} assignment={props.assignment} questions={props.questions[index]!} activity={item}/>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

type ActivityCardProps = {
  assignment: Assignment
  questions: Question[]
  activity: Activity
}

export function ActivityCard(props: ActivityCardProps) {
  const router = useRouter()

  const getPts = () => {
    // Compute total points
    let totalPts = 0;
    for (let i = 0; i < props.questions.length; i++) {
      totalPts += props.questions[i]!.pts
    }
    return totalPts
  }

  return (
    <div className="card w-full bg-base border border-neutral m-4">
        <div className="flex flex-row h-full">
          <div className="flex justify-center items-center border-r border-neutral p-6">
            <FontAwesomeIcon icon={getIcon(props.activity.type)} className="fa-3x h-8 w-12"/>
          </div>
          <div className="flex flex-col w-9/12 p-4">
            <h2 className="card-title">{props.activity.name}</h2>
            <p className="card-subtitle">{props.activity.description}</p>
          </div>
          <h2 className="card-title w-24">{getPts()} pts</h2>
        </div>
    </div>
  )
  }
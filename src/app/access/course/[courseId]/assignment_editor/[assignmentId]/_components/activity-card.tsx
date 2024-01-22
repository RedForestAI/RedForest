import { Activity, Assignment, ActivityType } from '@prisma/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";

type ActivityCardProps = {
  icon: IconDefinition
  assignment: Assignment
  activity: Activity
}

export function ActivityCard(props: ActivityCardProps) {
  const router = useRouter()

  const openActivitySetting = () => {
    router.push(`${props.assignment.id}/activity_editor/${props.activity.id}`)
  }

  return (
    <div className="card w-full bg-base border-[3px] border-solid shadow-xl m-4">
        <div className="flex flex-row h-full">
          <div className="flex justify-center items-center border-r p-6">
            <FontAwesomeIcon icon={props.icon} className="fa-3x h-8"/>
          </div>
          <div className="flex flex-col w-9/12 p-4">
            <h2 className="card-title">{props.activity.name}</h2>
            <p className="card-subtitle">{props.activity.description}</p>
          </div>
          <h2 className="card-title w-24">5 pts</h2>
          <div className="flex justify-end items-center w-1/12 pr-4">
            <button className="btn btn-ghost btn-sm mr-4" onClick={openActivitySetting}>
              <FontAwesomeIcon icon={faGear} className='h-8 fa-2x' />
            </button>
          </div>
        </div>
    </div>
  )
}

export function EmptyActivityCard(props: {assignmentId: string, activities: Activity[], setActivities: any}) {
  const mutation = api.activity.createEmpty.useMutation();

  const createActivity = async () => {
    try {
      const result = await mutation.mutateAsync({index: props.activities.length, assignmentId: props.assignmentId});
      console.log("Created activity: ", result)
      props.setActivities([...props.activities, result])
    } catch (error) {
      console.log("Failed to create assignment: ", error)
    }
  }
  return (
    <div className="card w-full border-[2px] shadow-xl m-4 cursor-pointer" onClick={createActivity}>
      <div className="justify-center items-center flex flex-col h-28">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}
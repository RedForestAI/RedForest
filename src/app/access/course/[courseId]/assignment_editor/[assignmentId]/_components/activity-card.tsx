import { Activity, Assignment, Question, ActivityType } from '@prisma/client';
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { getIcon } from "../_utils/icons"

type ActivityCardProps = {
  assignment: Assignment
  questions: Question[]
  activity: Activity
}

export function ActivityCard(props: ActivityCardProps) {
  const router = useRouter()
    

  const openActivitySetting = () => {
    router.push(`${props.assignment.id}/activity_editor/${props.activity.id}`)
  }

  const getPts = () => {
    // Compute total points
    let totalPts = 0;
    for (let i = 0; i < props.questions.length; i++) {
      totalPts += props.questions[i]!.pts
    }
    return totalPts
  }

  return (
    <div className="card w-full bg-base border-[3px] border-solid shadow-xl m-4">
        <div className="flex flex-row h-full">
          <div className="flex justify-center items-center border-r p-6">
            <FontAwesomeIcon icon={getIcon(props.activity.type)} className="fa-3x h-8 w-12"/>
          </div>
          <div className="flex flex-col w-9/12 p-4">
            <h2 className="card-title">{props.activity.name}</h2>
            <p className="card-subtitle">{props.activity.description}</p>
          </div>
          <h2 className="card-title w-24">{getPts()} pts</h2>
          <div className="flex justify-end items-center w-1/12 pr-4">
            <button className="btn btn-ghost btn-sm mr-4" onClick={openActivitySetting}>
              <FontAwesomeIcon icon={faGear} className='h-8 fa-2x' />
            </button>
          </div>
        </div>
    </div>
  )
}

export function EmptyActivityCard(props: {assignmentId: string, activities: Activity[], setActivities: any, questions: Question[][], setQuestions: any}) {
  const router = useRouter();
  const mutation = api.activity.createEmpty.useMutation();
  let [isOpen, setIsOpen] = useState<boolean>(false)

  let activityOptions = [
    {
      type: ActivityType.READING, 
      name: "Reading", 
      description: "Reading PDFs and answering questions",
      onClick: async () => {
        await createActivity(ActivityType.READING)
        setIsOpen(false)
        // @ts-ignore 
        document.getElementById('activity_selection').close()
      }
    },
    {
      type: ActivityType.QUESTIONING, 
      name: "Questioning", 
      description: "Answering questions given a text prompt",
      onClick: async () => {
        await createActivity(ActivityType.QUESTIONING)
        setIsOpen(false)
        // @ts-ignore 
        document.getElementById('activity_selection').close()
      }
    }
  ]

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    // @ts-ignore
    document.getElementById('activity_selection').showModal()
  }

  const createActivity = async (type: ActivityType) => {
    try {
      const result = await mutation.mutateAsync({index: props.activities.length, type: type, assignmentId: props.assignmentId});
      props.setActivities([...props.activities, result])
      props.setQuestions([...props.questions, []])
    } catch (error) {
      console.log("Failed to create assignment: ", error)
    }
  }

  return (
    <>
      <div className="card w-full border-[2px] shadow-xl m-4 cursor-pointer" onClick={openModal}>
        <div className="justify-center items-center flex flex-col h-28">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>

      <dialog id="activity_selection" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Activity Selection</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          
          {activityOptions.map((activityOption, index) => (
            <div key={index} className="card h-1/3 w-full bg-base border-[3px] border-solid shadow-xl mt-2 cursor-pointer" onClick={activityOption.onClick}>
              <div className="flex flex-row h-full">
                <div className="flex justify-center items-center border-r p-6">
                  <FontAwesomeIcon icon={getIcon(activityOption.type)} className="fa-3x h-8 w-12"/>
                </div>
                <div className="flex flex-col w-9/12 p-4">
                  <h2 className="card-title">{activityOption.name}</h2>
                  <p className="card-subtitle">{activityOption.description}</p>
                </div>
              </div>
            </div>
          ))
          }
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
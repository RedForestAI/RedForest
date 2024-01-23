import { Activity, Assignment, Question, ActivityType } from '@prisma/client';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { faBook } from "@fortawesome/free-solid-svg-icons"

type ActivityCardProps = {
  assignment: Assignment
  questions: Question[]
  activity: Activity
}

const getIcon = (type: ActivityType): IconDefinition => {
  switch (type) {
    case (ActivityType.READING):
      return faBook
  }
  return faBook
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
            <FontAwesomeIcon icon={getIcon(props.activity.type)} className="fa-3x h-8"/>
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

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const createActivity = async () => {
    try {
      const result = await mutation.mutateAsync({index: props.activities.length, assignmentId: props.assignmentId});
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
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-base-100 rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 border-b-4 border-inherit pb-2"
                  >
                    Activity Selector
                  </Dialog.Title>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

import { api } from "~/trpc/react"
import { Course, Assignment, Activity, ActivityData, AssignmentData, Question, ActivityType } from '@prisma/client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ActivityCompletionProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
  ammountOfActivities: number
  currentActId: number
  setCurrentActId: (id: number) => void

  complete: boolean
  isSubmitting: boolean
}

export default function ActivityCompletion(props: ActivityCompletionProps) {
  // State
  const [ assignmentComplete, setAssignmentComplete ] = useState<boolean>(false)
  const router = useRouter()

  const markAsCompleteMutation = api.activityData.markAsComplete.useMutation()
  const assignmentCompleteMutation = api.assignmentData.markAsComplete.useMutation()
  
  useEffect(() => {
    async function completeActivity() {
      // Mark as complete
      try {
        await markAsCompleteMutation.mutateAsync({id: props.activityData.id})
      } catch (error) {
        console.error(error)
        return
      }

      // If activity is READING
      if (props.activity.type == ActivityType.READING) {
      }

      // Check if assignment is complete
      if (props.currentActId == props.ammountOfActivities - 1){
        await assignmentCompleteMutation.mutateAsync({id: props.assignmentData.id})
        setAssignmentComplete(true)
      }
    }
    completeActivity()
  }, [props.complete])

  function nextActivity() {

    // Next activity
    if (props.currentActId < props.ammountOfActivities - 1){
      props.setCurrentActId(props.currentActId + 1)
      return;
    }
  }

  function finishAssignment() {
    // Return to dashboard
    router.push(`/access/course/${props.course.id}`)
    router.refresh()
  }

  function getPage() {
    if (assignmentComplete) {
      return (
        <>
          <div className="self-stretch text-4xl mt-4 max-md:max-w-full">
            You have completed this assignment!
          </div>
          {props.isSubmitting
           ?  <>
            <div className="self-stretch text-lg mt-2.5 max-md:max-w-full">
              Please wait while we upload your session files.
            </div>
          </>
           :  <>
            <div className="self-stretch text-lg mt-2.5 max-md:max-w-full">
              Press continue to return to Dashboard.
            </div>
          </>
          }
          <div className="flex justify-end w-full items-center mt-4">
            <button className="btn btn-primary" disabled={props.isSubmitting} onClick={finishAssignment}>Continue</button>
          </div>
        </>
      )
    }
    return (
      <>
        <div className="self-stretch text-4xl mt-4 max-md:max-w-full">
          You have completed this activity!
        </div>
        {props.isSubmitting
           ?  <>
            <div className="self-stretch text-lg mt-2.5 max-md:max-w-full">
              Please wait while we upload your session files.
            </div>
          </>
           :  <>
            <div className="self-stretch text-lg mt-2.5 max-md:max-w-full">
              Press continue to the next activity when you are ready.
            </div>
          </>
        }
        <div className="flex justify-end w-full items-center mt-4">
          <button className="btn btn-primary" disabled={props.isSubmitting} onClick={nextActivity}>Continue</button>
        </div>
      </>
    )
  }
  
  return (
    <div className="container sm:max-w-[90vw] md:max-w-[80vw]">
      <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch rounded-2xl max-md:max-w-full mt-5">
        <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: "100%"}}> 100%</div>
      </div>
      {getPage()}
    </div>
  )
}
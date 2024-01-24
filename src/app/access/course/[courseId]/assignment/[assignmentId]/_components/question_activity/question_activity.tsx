import { Course, Assignment, Activity, ActivityData, AssignmentData, Question } from '@prisma/client'
import { useState } from 'react'


type QuestionActivityProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
}

export default function QuestionActivity(props: QuestionActivityProps) {
  const [ currentQuestionId, setCurrentQuestionId ] = useState<number>(props.activityData.currentQuestionId)
  const [ complete, setComplete ] = useState<boolean>(false)

  function getProgress() {
    const totalQuestions = props.questions.length;
    return Math.floor((currentQuestionId / totalQuestions) * 100);
  }

  function nextQuestion() {
    console.log("Next question")
    console.log(currentQuestionId)
    console.log(props.questions.length)
    if (currentQuestionId < props.questions.length - 1) {
      setCurrentQuestionId(currentQuestionId + 1)
    } else {
      setCurrentQuestionId(currentQuestionId + 1)
      setComplete(true)
    }
  }

  function nextActivity() {
    console.log("Next activity")
  }

  return (
    <div className="items-start flex flex-col pt-3 pb-12 px-4">
      <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch rounded-2xl max-md:max-w-full mt-5">
        <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: `${getProgress()}%`}}> {getProgress()}%</div>
      </div>
      {!complete  
       ? <>
          <div className="self-stretch text-4xl mt-2.5 max-md:max-w-full">
            Question {currentQuestionId + 1}
          </div>
          <div className="self-stretch text-xs mt-2.5 max-md:max-w-full">
            {props.questions[currentQuestionId]?.content}
          </div>
          {props.questions[currentQuestionId]?.type === "MULTIPLE_CHOICE" &&
            // Iterate through each choice
            props.questions[currentQuestionId]?.options.map((choice, index) => {
              return (
                <div key={index} className="flex justify-start items-center w-full mt-4">
                  <input type="radio" name={`radio-answer`} className="radio mr-4" />
                  <label className="text-xs">{choice}</label>
                </div>
              )
            })
          }
          <div className="flex justify-end w-full items-center mt-4">
            <button className="btn btn-primary" onClick={nextQuestion}>Continue</button>
          </div>
        </>
        : <>
          <div className="self-stretch text-4xl mt-4 max-md:max-w-full">
            You have completed this activity!
          </div>
          <div className="self-stretch text-xs mt-2.5 max-md:max-w-full">
            Press continue when ready.
          </div>
          <div className="flex justify-end w-full items-center mt-4">
            <button className="btn btn-primary" onClick={nextActivity}>Continue</button>
          </div>
        </>
      }
    </div>
  )
}
import { Reorder } from "framer-motion";
import { useState } from "react";

type QuestionCardProps = {
  question: any
}

function EmptyAnswerCard() {
  return (
    <div className="card w-full border-[2px] border shadow-xl m-4">
      <div className="justify-center items-center flex flex-col h-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}

export function QuestionCard(props: QuestionCardProps) {
  const [answers, setAnswers] = useState<string[]>(["Option 1", "Option 2", "Option 3"])

  return (
    <div className="card bg-base-300 w-full m-4 p-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label> 
        <textarea placeholder="Question content" className="textarea textarea-bordered h-24"></textarea>
      </div>

      {/* Question Type via radio buttons*/}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Question Type</span>
        </label> 
        <div className="flex flex-row justify-around items-center space-x-4">
          <label className="">
            <input type="radio" name="radio" />
            <span className="radio-mark"></span> Multiple Choice
          </label> 
          <label className="">
            <input type="radio" name="radio" />
            <span className="radio-mark"></span> True/False
          </label>
          <label className="">
            <input type="radio" name="radio" />
            <span className="radio-mark"></span> Likert Scale
          </label> 
        </div>
      </div>

      {/* Question Answer Options */}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Question Options</span>
        </label> 
        <div className="flex flex-row justify-around items-center space-x-4">
          <Reorder.Group axis="y" values={answers} onReorder={setAnswers}>
            {answers.map((item) => (
              <Reorder.Item key={item} value={item}>
                <QuestionCard question={item} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyAnswerCard />
        </div>
      </div>
    </div>
  )
}

export function EmptyQuestionCard() {
  return (
    <div className="card w-full border-[2px] shadow-xl m-4">
      <div className="justify-center items-center flex flex-col h-28">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}
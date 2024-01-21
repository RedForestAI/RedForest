import { Reorder } from "framer-motion";
import { useState } from "react";
import { generateUUID } from "~/utils/uuid";

type QuestionCardProps = {
  question: any
}

type AnswerCardProps = {
  answer: any
}

function AnswerCard(props: AnswerCardProps) {
  return (
    <div className="card shadow-xl mb-4">
      <textarea placeholder="Answer" className="textarea textarea-bordered h-24">{props.answer}</textarea>
    </div>
  )
}


function EmptyAnswerCard() {
  return (
    <div className="card border-[2px] border shadow-xl mb-4">
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
    <div tabIndex={0} className="collapse collapse-arrow bg-base-300 w-full m-4 p-4">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Question
      </div>
      <div className="collapse-content">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label> 
          <textarea placeholder="Question content" className="textarea textarea-bordered h-24"></textarea>
        </div>

        {/* Points per question, default to 1*/}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Points</span>
          </label> 
          <input type="number" placeholder="1" className="input input-bordered" />
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
          <Reorder.Group axis="y" values={answers} onReorder={setAnswers}>
            {answers.map((item) => (
              <Reorder.Item key={item} value={item}>
                <AnswerCard answer={item} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyAnswerCard />
        </div>
      </div>
    </div>
  )
}

export function EmptyQuestionCard(props: {setQuestions: any}) {

  const createQuestion = () => {
    props.setQuestions((prev: any) => [...prev, {id: generateUUID(), content: "What is the meaning of life?", options: {}, answer: 1, activityId: "1"}])
  }

  return (
    <div className="card w-full border-[2px] shadow-xl m-4 cursor-pointer" onClick={createQuestion}>
      <div className="justify-center items-center flex flex-col h-28">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}
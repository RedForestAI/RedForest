import { Question, QuestionType } from "@prisma/client"
import { Reorder } from "framer-motion";
import { useState } from "react";
import { generateUUID } from "~/utils/uuid";

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type QuestionCardProps = {
  index: number
  question: Question
  setQuestions: any
}

type AnswerCardProps = {
  index: number
  answer: string
  setAnswers: any
}

function AnswerCard(props: AnswerCardProps) {

  const deleteAnswer = () => {
    props.setAnswers((prev: any) => prev.filter((answer: string) => answer !== props.answer))
  }

  return (
    <div className="card shadow-xl mb-4 flex flex-row">
      <textarea placeholder="Answer" className="textarea textarea-bordered h-18 w-full">{props.answer}</textarea>
      <div className="flex justify-center items-center">
        <button className="btn btn-ghost btn-sm mr-4" onClick={deleteAnswer}>
          <FontAwesomeIcon icon={faTrash} className='h-4' />
        </button>
      </div>
    </div>
  )
}


function EmptyAnswerCard(props: {setAnswers: any}) {
  const createAnswer = () => {
    props.setAnswers((prev: any) => [...prev, ""])
  }

  return (
    <div className="card border-[2px] border shadow-xl mb-4 cursor-pointer" onClick={createAnswer}>
      <div className="justify-center items-center flex flex-col h-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}

export function QuestionCard(props: QuestionCardProps) {
  const [answers, setAnswers] = useState<string[]>(props.question.options)
  const [open, setOpen] = useState<boolean>(false)

  const setNumberInput = (event: any) => {
    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, pts: event.target.value}
      }
      return question
    }))
  }

  const deleteQuestion = () => {
    console.log("Deleting question")
    props.setQuestions((prev: any) => prev.filter((question: Question) => question.id !== props.question.id))
  }

  return (
    <div className={`collapse bg-base-300 w-full m-4 p-4 ${open ? 'collapse-open' : 'collapse-close'}`}>
      <div className="text-xl font-medium flex justify-between items-center">
        Question {props.index + 1}
        <div>
          <button className="btn btn-ghost btn-sm mr-4" onClick={deleteQuestion}>
            <FontAwesomeIcon icon={faTrash} className='h-4' />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => {setOpen(!open)}}>{open ? "+" : "-"}</button>
        </div>
      </div>
      <div className="collapse-content">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label> 
          <textarea placeholder="Question content" className="textarea textarea-bordered h-24">{props.question.content}</textarea>
        </div>

        {/* Points per question, default to 1*/}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Points</span>
          </label> 
          <input type="number" placeholder="1" className="input input-bordered" value={props.question.pts} onChange={setNumberInput}/>
        </div>

        {/* Question Type via radio buttons*/}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Question Type</span>
          </label> 
          <div className="flex flex-row justify-around items-center space-x-4">
            <label className="">
              <input type="radio" name="radio" checked={props.question.type == QuestionType.MULTIPLE_CHOICE}/>
              <span className="radio-mark"></span> Multiple Choice
            </label> 
            <label className="">
              <input type="radio" name="radio" checked={props.question.type == QuestionType.TRUE_FALSE}/>
              <span className="radio-mark"></span> True/False
            </label>
            <label className="">
              <input type="radio" name="radio" checked={props.question.type == QuestionType.LIKERT_SCALE}/>
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
            {answers.map((item, index) => (
              <Reorder.Item key={item} value={item}>
                <AnswerCard index={index} answer={item} setAnswers={setAnswers}/>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <EmptyAnswerCard setAnswers={setAnswers}/>
        </div>
      </div>
    </div>
  )
}

export function EmptyQuestionCard(props: {setQuestions: any}) {

  const createQuestion = () => {
    props.setQuestions((prev: any) => [...prev, {id: generateUUID(), content: "What is the meaning of life?", options: [], answer: 1, activityId: "1"}])
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
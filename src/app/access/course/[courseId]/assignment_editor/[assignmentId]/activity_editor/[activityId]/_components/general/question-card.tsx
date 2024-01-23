import { Question, QuestionType } from "@prisma/client"
import { Reorder } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { generateUUID } from "~/utils/uuid";
import { api } from "~/trpc/react";

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type QuestionCardProps = {
  index: number
  question: Question
  setQuestions: any
}

type AnswerCardProps = {
  question_index: number
  index: number
  answerText: string
  answer: number
  setQuestions: any
}

function AnswerCard(props: AnswerCardProps) {

  const deleteAnswer = () => {
    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.index === props.question_index) {
        return {...question, options: question.options.filter((answer: string, index: number) => index !== props.index)}
      }
      return question
    }))
  }

  const setText = (event: any) => {
    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.index === props.question_index) {
        return {...question, options: question.options.map((answer: string, index: number) => {
          if (index === props.index) {
            return event.target.value
          }
          return answer
        })}
      }
      return question
    }))
  }

  const setAnswer = () => {
    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.index === props.question_index) {
        return {...question, answer: props.index}
      }
      return question
    }))
  }

  return (
    <div className="card shadow-xl mb-4 flex flex-row">
      <div className="flex justify-between items-center w-full">
        <input type="radio" name={`radio-${props.question_index}-answer`} checked={props.answer == props.index} onChange={setAnswer} className="radio mr-2" />
        <textarea value={props.answerText} onChange={setText} placeholder="Answer" className="textarea textarea-bordered h-18 w-full"></textarea>
        <button className="btn btn-ghost btn-sm mr-2" onClick={deleteAnswer}>
          <FontAwesomeIcon icon={faTrash} className='h-4' />
        </button>
      </div>
    </div>
  )
}


function EmptyAnswerCard(props: {question_index: number, setQuestions: any}) {
  const createAnswer = () => {
    // If no prior answers, mark this as the correct answer
    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.index === props.question_index) {
        if (question.options.length === 0) {
          return {...question, answer: 0}
        }
        return question
      }
      return question
    }))

    props.setQuestions((prev: any) => prev.map((question: Question) => {
      if (question.index === props.question_index) {
        return {...question, options: [...question.options, ""]}
      }
      return question
    }))
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
  
  // State
  const [open, setOpen] = useState<boolean>(false)
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0);

  const deleteMutation = api.question.delete.useMutation();

  const setNumberInput = (event: any) => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, pts: Number(event.target.value)}
      }
      return question
    }))
  }

  const setQuestionContent = (event: any) => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, content: event.target.value}
      }
      return question
    }))
  }

  const setAnswers = (newAnswers: any) => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return { ...question, options: newAnswers(question.options) };
      }
      return question;
    }));
  };

  const setMC = () => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, type: QuestionType.MULTIPLE_CHOICE}
      }
      return question
    }))
  }

  const setTF = () => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, type: QuestionType.TRUE_FALSE}
      }
      return question
    }))
  }

  const setLS = () => {
    props.setQuestions((prev: Question[]) => prev.map((question: Question) => {
      if (question.id === props.question.id) {
        return {...question, type: QuestionType.LIKERT_SCALE}
      }
      return question
    }))
  }

  const deleteQuestion = async () => {
    const result = await deleteMutation.mutateAsync({id: props.question.id})
    props.setQuestions((prev: any) => prev.filter((question: Question) => question.id !== props.question.id))
  }

  useEffect(() => {
    if (props.question.type === QuestionType.MULTIPLE_CHOICE) {
      setContentHeight(contentRef?.current!.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [props.question.type, props.question, open]);

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
          <textarea placeholder="Question content" className="textarea textarea-bordered h-24" value={props.question.content} onChange={setQuestionContent}></textarea>
        </div>

        {/* Points per question, default to 1*/}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Points</span>
          </label> 
          <input type="number" placeholder="1" className="input input-bordered" value={props.question.pts} onChange={setNumberInput}/>
        </div>

        {/* Question Type via radio buttons*/}
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Question Type</span>
          </label> 
          <div className="flex flex-row justify-around items-center space-x-4">
            <label className="flex justify-center items-center">
              <input type="radio" className="radio mr-2" name={`radio-${props.index}`} checked={props.question.type == QuestionType.MULTIPLE_CHOICE} onChange={setMC}/>
              <span className="radio-mark"></span> Multiple Choice
            </label> 
            <label className="flex justify-center items-center">
              <input type="radio" className="radio mr-2" name={`radio-${props.index}`} checked={props.question.type == QuestionType.TRUE_FALSE} onChange={setTF}/>
              <span className="radio-mark"></span> True/False
            </label>
            <label className="flex justify-center items-center">
              <input type="radio" className="radio mr-2" name={`radio-${props.index}`} checked={props.question.type == QuestionType.LIKERT_SCALE} onChange={setLS}/>
              <span className="radio-mark"></span> Likert Scale
            </label> 
          </div>
        </div>

        {/* Question Answer Options */}
        <div 
          ref={contentRef}
          style={{maxHeight: `${contentHeight}px`}}
          className={`form-control mt-4 transition-all duration-500 ${props.question.type === QuestionType.MULTIPLE_CHOICE ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Question Options</span>
              </label> 
              <Reorder.Group axis="y" values={props.question.options} onReorder={setAnswers}>
                {props.question.options.map((item, index) => (
                  <Reorder.Item key={index} value={item}>
                    <AnswerCard question_index={props.index} index={index} answer={props.question.answer} answerText={item} setQuestions={props.setQuestions}/>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <EmptyAnswerCard question_index={props.index} setQuestions={props.setQuestions}/>
            </div>
        </div>
      </div>
    </div>
  )
}

export function EmptyQuestionCard(props: {activityId: string, questions: Question[], setQuestions: any}) {

  const createMutation = api.question.create.useMutation();

  const createQuestion = async () => {
    const result: Question = await createMutation.mutateAsync({
      activityId: props.activityId, 
      content: "Question Content", 
      options: [], 
      answer: 0,
      type: QuestionType.MULTIPLE_CHOICE,
      pts: 1,
      index: props.questions.length,
    })
    props.setQuestions((prev: any) => [...prev, result])
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
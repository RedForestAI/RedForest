import { Question, QuestionType } from "@prisma/client"
import { Reorder } from "framer-motion";
import { useState } from "react";

import { QuestionCard, EmptyQuestionCard } from "./question-card";

type QuestionsProps = {
    questions: Question[]
    setQuestions: any
}

export default function Questions(props: QuestionsProps) {
  
  return (
    <div role="tabpanel" className="tab-content p-6">
      <div className="form-control">
        <Reorder.Group axis="y" values={props.questions} onReorder={props.setQuestions}>
          {props.questions.map((item, index) => (
            <Reorder.Item key={item.id} value={item}>
              <QuestionCard index={index} question={item} setQuestions={props.setQuestions} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <EmptyQuestionCard setQuestions={props.setQuestions}/>
      </div>
    </div>
  )
}
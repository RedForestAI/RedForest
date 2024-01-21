import { Question } from "@prisma/client"
import { Reorder } from "framer-motion";
import { useState } from "react";

import { QuestionCard, EmptyQuestionCard } from "./question-card";

type QuestionsProps = {
  questions: Question[]
  setQuestions: any
}

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([{id: "1", content: "What is the meaning of life?", options: {}, answer: 1, activityId: "1"}])

  return (
    <div role="tabpanel" className="tab-content p-6">
      <div className="form-control">
        <Reorder.Group axis="y" values={questions} onReorder={setQuestions}>
          {questions.map((item) => (
            <Reorder.Item key={item.id} value={item}>
              <QuestionCard question={item} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <EmptyQuestionCard setQuestions={setQuestions}/>
      </div>
    </div>
  )
}
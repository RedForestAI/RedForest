"use client";

import {
  Course,
  Assignment,
  Activity,
  ActivityData,
  AssignmentData,
  Question,
} from "@prisma/client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { triggerActionLog } from "~/loggers/actions-logger";

type QuestionConfig = {
  beforeStartPrompt: boolean;
};

type QuestionsProps = {
  course: Course;
  assignment: Assignment;
  activity: Activity;
  activityData: ActivityData;
  questions: Question[];
  assignmentData: AssignmentData;
  ammountOfActivities: number;
  currentActId: number;
  setCurrentActId: (id: number) => void;

  complete: boolean;
  setComplete: (complete: boolean) => void;

  // Configs
  config?: Partial<QuestionConfig>;
};

// Default configs
const defaultConfig: QuestionConfig = {
  beforeStartPrompt: false,
};

type ScoreTrack = {
  answer: string;
  optionValue: string;
  correct: boolean;
  pts: number;
  elapsedTime: number;
  accumulativeScore: number;
};

export default function Questions(props: QuestionsProps) {
  // Configs
  const finalConfig = { ...defaultConfig, ...props.config };

  // State
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(
    props.activityData.currentQuestionId,
  );
  const [priorQuestionSubmitTime, setPriorQuestionSubmitTime] = useState<Date>(new Date())// [ms]
  const [startQuestions, setStartQuestions] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [scores, setScores] = useState<ScoreTrack[]>([]);

  // Mutations
  const appendAnswerMutation = api.activityData.appendAnswer.useMutation();

  function getProgress() {
    const totalQuestions = props.questions.length;
    return Math.floor((currentQuestionId / totalQuestions) * 100);
  }

  function startQuestionsAction() {
    setStartQuestions(true);
    setPriorQuestionSubmitTime(new Date());
    triggerActionLog({ type: "questionStart", value: { start: true } });
  }

  async function onSubmit(data: any) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Compute the elapsed time
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - priorQuestionSubmitTime.getTime();
    setPriorQuestionSubmitTime(currentTime);

    // Update choice in the database
    let response = { correct: false, pts: 0, accumulativeScore: 0 };
    try {
      response = await appendAnswerMutation.mutateAsync({
        activityDataId: props.activityData.id,
        activityId: props.activity.id,
        index: currentQuestionId,
        answer: Number(data.answer),
        elapsedTime: elapsedTime,
      });
    } catch (error) {
      console.log(error);
      return;
    }

    // Add to the score
    // scores.push({
    //   answer: data.answer,
    //   optionValue:
    //     props.questions[currentQuestionId]?.options[Number(data.answer)] || "",
    //   correct: response.correct,
    //   pts: response.pts,
    // });
    setScores([
      ...scores,
      {
        answer: data.answer,
        optionValue:
          props.questions[currentQuestionId]?.options[Number(data.answer)] || "",
        correct: response.correct,
        pts: response.pts,
        elapsedTime: elapsedTime,
        accumulativeScore: response.accumulativeScore,
      },
    ]);

    triggerActionLog({
      type: "questionSubmit",
      value: {
        currentQuestionId: currentQuestionId,
        option: data.answer,
        optionValue:
          props.questions[currentQuestionId]?.options[Number(data.answer)],
        correct: response.correct,
        pts: response.pts,
      },
    });

    if (currentQuestionId < props.questions.length - 1) {
      setCurrentQuestionId(currentQuestionId + 1);
      triggerActionLog({
        type: "questionLoad",
        value: { upcomingQuestionId: currentQuestionId + 1 },
      });
    } else {
      // Check for activity complete
      setCurrentQuestionId(currentQuestionId + 1);
      props.setComplete(true);

      // Compute the score and log again for redundancy
      let totalPtsEarned = 0;
      let totalPtsPossible = 0;
      scores.forEach((score) => {
        if (score.correct) {
          totalPtsEarned += score.pts;
        }
        totalPtsPossible += score.pts;
      });
      let scorePercentage = (totalPtsEarned / totalPtsPossible) * 100;
      triggerActionLog({
        type: "activityComplete",
        value: {
          complete: true,
          score: scorePercentage.toFixed(1),
          scores: scores,
        },
      });
    }

    reset();
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!finalConfig.beforeStartPrompt) {
      triggerActionLog({
        type: "questionLoad",
        value: { upcomingQuestionId: currentQuestionId },
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-start px-4 pb-12 pt-3">
      {finalConfig.beforeStartPrompt && !startQuestions ? (
        <>
          <h1 className="pb-8 text-2xl text-5xl font-bold">Before starting!</h1>
          <p className="pb-8 text-xl">
            Before starting questions, make sure to complete reading the
            passages. Once you have completed, then press Continue.
          </p>
          <button className="btn btn-primary" onClick={startQuestionsAction}>
            Continue
          </button>
        </>
      ) : (
        <>
          <div className="mt-2 flex flex-col items-stretch justify-center self-stretch rounded-2xl bg-neutral max-md:max-w-full">
            <div
              className="rounded-full bg-primary p-0.5 text-center text-xs font-medium leading-none text-primary-content"
              style={{ width: `${getProgress()}%` }}
            >
              {" "}
              {getProgress()}%
            </div>
          </div>

          <div className="mt-2.5 self-stretch text-5xl max-md:max-w-full">
            Question {currentQuestionId + 1}
          </div>
          <div className="mt-2.5 self-stretch text-lg max-md:max-w-full">
            {props.questions[currentQuestionId]?.content}
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            {props.questions[currentQuestionId]?.type === "MULTIPLE_CHOICE" &&
              // Iterate through each choice
              props.questions[currentQuestionId]?.options.map(
                (choice, index) => {
                  return (
                    <div
                      key={index}
                      className="mt-4 flex w-full items-center justify-start"
                    >
                      <input
                        {...register(`answer`, { required: true })}
                        value={index}
                        type="radio"
                        className="radio-primary radio mr-4"
                      />
                      <label className="text">{choice}</label>
                    </div>
                  );
                },
              )}
            <div className="mt-4 flex w-full items-center justify-end">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                Continue
              </button>
            </div>
          </form>
        </>
      )}

      {errors.answer && (
        <div className="toast toast-end">
          <div className="alert alert-error flex flex-row">
            <span>Missing answer choice</span>
            <button
              className="btn btn-ghost"
              onClick={() => clearErrors("answer")}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

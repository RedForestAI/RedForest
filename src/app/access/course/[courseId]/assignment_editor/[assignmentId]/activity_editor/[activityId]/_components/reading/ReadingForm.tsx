"use client";

import { Activity, ReadingActivity, Question, ReadingFile } from '@prisma/client';
import { useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';

import General from "../general/General"
import Readings from "./Readings"
import Questions from "../general/Questions"

type ReadingFormProps = {
  courseId: string
  assignmentId: string
  activity: Activity
  questions: Question[]
  readingActivity: ReadingActivity
  files: ReadingFile[]
}

type LabelProps = {
  index: number
  text: string
  selectedTab: number
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>
}

function Label(props: LabelProps) {
  return (
    <>
    <input 
      type="radio" 
      name="my_tabs_2" 
      role="tab" 
      className={`tab cursor-pointer py-2 px-4 ${
        props.selectedTab === props.index ? 'text-accent [--tab-bg:bg-primary]' : ''
      }`}
      aria-label={props.text} 
      defaultChecked={props.selectedTab === props.index} 
      onClick={() => props.setSelectedTab(props.index)}
    />
    </>
  )
}

export default function ReadingForm(props: ReadingFormProps) {

  // State
  const router = useRouter();
  const [activity, setActivity] = useState<Activity>(props.activity);
  const [questions, setQuestions] = useState<Question[]>(props.questions);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [files, setFiles] = useState<ReadingFile[]>(props.files);

  // Mutations
  const deleteMutation = api.activity.deleteOne.useMutation();
  const updateMutation = api.activity.update.useMutation();
  const updateQuestionMutation = api.question.update.useMutation();
  const updateFiles = api.readingFile.update.useMutation();

  const deleteFunction = async () => {
    try {
      await deleteMutation.mutateAsync({id: activity.id});
      router.push(`/access/course/${props.courseId}/assignment_editor/${props.assignmentId}`)
      router.refresh()
    } catch (error) {
      console.log("Failed to delete activity: ", error)
    }
  }

  const saveFunction = async () => {
    
    // Settings
    try { 
      await updateMutation.mutateAsync({id: activity.id, name: activity.name, description: activity.description! });
    } catch (error) {
      console.log("Failed to update activity: ", error)
    }

    // Readings
    try {
      // First update their index based on their position in the array
      files.forEach((file: ReadingFile, index: number) => {
        file.index = index;
      })

      await Promise.all(files.map(async (file: ReadingFile) => {
        await updateFiles.mutateAsync({id: file.id, index: file.index})
      }))
    } catch (error) {
      console.log("Failed to update files: ", error)
    }

    // Questions
    try {
      // First update their index based on their position in the array
      questions.forEach((question: Question, index: number) => {
        question.index = index;
      })

      await Promise.all(questions.map(async (question: Question) => {
        await updateQuestionMutation.mutateAsync({
          id: question.id, 
          content: question.content, 
          index: question.index,
          options: question.options,
          type: question.type,
          answer: question.answer,
          pts: question.pts
        })
      }))
    } catch (error) {
      console.log("Failed to update questions: ", error)
    }
    
  }

  const publishFunction = async () => {
    await saveFunction();
  }

  const submitAllForms = async (e: any) => {
    e.preventDefault()

    // Determine what button was pressed and which action to perform
    const action = e.nativeEvent.submitter.value;

    if (action === "Delete") {
      deleteFunction();
      return;
    }
    else if (action === "Save") {
      saveFunction();
      return;
    }
    else if (action === "Save&Close") {
      saveFunction();
      router.push(`/access/course/${props.courseId}/assignment_editor/${props.assignmentId}`)
      router.refresh();
      return;
    }
    else {
      return;
    }
  }

  return (
    <form onSubmit={submitAllForms}>
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Label index={0} text="General Settings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <General activity={activity} setActivity={setActivity}/>

        <Label index={1} text="Readings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Readings readingActivity={props.readingActivity} files={files} setFiles={setFiles}/>

        <Label index={2} text="Questions" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Questions activityId={activity.id} questions={questions} setQuestions={setQuestions}/>
      
      </div>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="btn btn-error text-white" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
        </div>
      </div>
    </form>
  )
}

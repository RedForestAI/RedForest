"use client";

import { Activity, ReadingActivity } from '@prisma/client';
import { useState, useEffect } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import General from "./general"
import Readings from "./readings"
import Questions from "./questions"

type GeneralInputs = {
  name: string
  description: string
}

type ReadingFormProps = {
  courseId: string
  assignmentId: string
  activity: Activity
  readingActivity: ReadingActivity | null
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
  const [readingActivity, setReadingActivity] = useState<ReadingActivity | null>(props.readingActivity);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const forms = {
    general: useForm<GeneralInputs>(),
  }

  // Mutations
  const deleteMutation = api.activity.deleteOne.useMutation();

  useEffect(() => {
    forms.general.reset({ ...activity})
  }, [activity]);

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
    console.log("Submitting all forms")
    // await forms.assignmentSettings.handleSubmit(settingsSubmit)();
    // router.push(`/access/course/${props.courseId}`)
    // router.refresh();
  }

  const publishFunction = async () => {
    await saveFunction();
  }

  const submitAllForms = async (e: any) => {
    e.preventDefault()

    // Determine what button was pressed and which action to perform
    const action = e.nativeEvent.submitter.value;
    console.log(action)

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
    else if (action === "Publish") {
      publishFunction()
      return;
    }
    else {
      console.log("Unknown action")
      return;
    }
  }

  return (
    <form onSubmit={submitAllForms}>
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Label index={0} text="General Settings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <General activity={activity} formRegister={forms.general.register} errors={forms.general.formState.errors}/>

        <Label index={1} text="Readings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Readings/>

        <Label index={2} text="Questions" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Questions/>
      
      </div>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="btn btn-error" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
          <button className="btn btn-success" name="action" value="Publish">Publish</button>
        </div>
      </div>
    </form>
  )
}

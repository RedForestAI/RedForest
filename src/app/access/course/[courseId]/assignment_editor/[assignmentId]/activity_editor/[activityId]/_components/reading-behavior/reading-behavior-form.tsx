"use client";

import { Activity } from '@prisma/client';
import { useState } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';

import General from "../general/general"

type ReadingBehaviorFormProps = {
  courseId: string
  assignmentId: string
  activity: Activity
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

export default function ReadingBehaviorForm(props: ReadingBehaviorFormProps) {

  // State
  const router = useRouter();
  const [activity, setActivity] = useState<Activity>(props.activity);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Mutations
  const deleteMutation = api.activity.deleteOne.useMutation();
  const updateMutation = api.activity.update.useMutation();

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
      
      </div>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="btn btn-error" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
        </div>
      </div>
    </form>
  )
}
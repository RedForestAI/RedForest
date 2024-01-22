"use client";

import { Activity, ReadingActivity } from '@prisma/client';
import { useState } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';

import General from "./general"
import Readings from "./readings"
import Questions from "./questions"

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
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Mutations
  const deleteMutation = api.assignment.delete.useMutation();

  const deleteActivity = async () => {
    try {
      await deleteMutation.mutateAsync({id: props.activity.id});
      router.push(`/access/course/${props}/assignment_editor/${props.assignmentId}`)
      router.refresh()
    } catch (error) {
      console.log("Failed to delete assignment: ", error)
    }
  }

  return (
    <>
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Label index={0} text="General Settings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <General/>

        <Label index={1} text="Readings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Readings/>

        <Label index={2} text="Questions" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <Questions/>
      
      </div>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button onClick={deleteActivity} className="btn btn-error" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
          <button className="btn btn-success" name="action" value="Publish">Publish</button>
        </div>
      </div>
    </>
  )
}

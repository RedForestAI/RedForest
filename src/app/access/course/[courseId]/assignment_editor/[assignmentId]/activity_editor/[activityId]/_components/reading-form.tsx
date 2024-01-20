"use client";

import { Activity, ReadingActivity } from '@prisma/client';
import { useState } from 'react';

type ReadingFormProps = {
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
      // className="tab" 
      className={`tab cursor-pointer py-2 px-4 ${
        props.selectedTab === props.index ? 'text-emerald-500 [--tab-bg:bg-primary]' : ''
      }`}
      aria-label={`Tab ${props.index}`} 
      checked={props.selectedTab === props.index} 
      onClick={() => props.setSelectedTab(props.index)}
    />
    {/* <label 
      htmlFor={`tab-${props.index}`}
      role = "tab" 
      className={`tab cursor-pointer py-2 px-4 inline-block ${
        props.selectedTab === props.index ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500'
      }`}
      >
      {props.text}
    </label> */}
    </>
  )
}

export default function ReadingForm(props: ReadingFormProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div role="tablist" className="tabs tabs-lifted tabs-lg">
      <Label index={0} text="Tab 1" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 1</div>

      {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2" checked={selectedTab === 1} onChange={() => setSelectedTab(1)}/> */}
      <Label index={1} text="Tab 2" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 2</div>

      {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" checked={selectedTab === 2} onChange={() => setSelectedTab(2)}/> */}
      <Label index={2} text="Tab 3" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 3</div>
    </div>
  )
}

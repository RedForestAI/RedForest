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
      className={`tab cursor-pointer py-2 px-4 ${
        props.selectedTab === props.index ? 'text-accent [--tab-bg:bg-primary]' : ''
      }`}
      aria-label={props.text} 
      checked={props.selectedTab === props.index} 
      onClick={() => props.setSelectedTab(props.index)}
    />
    </>
  )
}

export default function ReadingForm(props: ReadingFormProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <>
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Label index={0} text="General Settings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box shadow-xl p-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label> 
            <input type="text" placeholder="Reading Name" className="input input-bordered"/>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label> 
            <textarea placeholder="Reading Description" className="textarea textarea-bordered h-24"></textarea>
          </div>
        </div>

        {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2" checked={selectedTab === 1} onChange={() => setSelectedTab(1)}/> */}
        <Label index={1} text="Readings" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box shadow-xl p-6">Tab content 2</div>

        {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" checked={selectedTab === 2} onChange={() => setSelectedTab(2)}/> */}
        <Label index={2} text="Questions" selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box shadow-xl p-6">Tab content 3</div>
      </div>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="btn btn-error" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
          <button className="btn btn-success" name="action" value="Publish">Publish</button>
        </div>
      </div>
    </>
  )
}

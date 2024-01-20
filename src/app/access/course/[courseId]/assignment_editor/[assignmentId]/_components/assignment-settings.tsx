"use client";
import { Assignment } from "@prisma/client"
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

type AssignmentSettingsProps = {
  assignment: Assignment | undefined
  formRegister: any
  control: any
  errors: any
}

export default function AssignmentSettings(props: AssignmentSettingsProps) {


  return (
    <div className="justify-center bg-white bg-opacity-0 flex flex-col pt-1.5 pb-4 px-3.5 items-start max-md:max-w-full">
      <div className="label"><span className="label-text text-lg">Assignment Information</span></div>
      <div className="items-stretch self-stretch gap-4 flex flex-col p-8 rounded-2xl border-[3px] border-solid border-white max-md:max-w-full max-md:px-5">
      { props.assignment
        ? <>
          <div>
            <div className="label"><span className="label-text">Name</span></div>
            <input type="text" {...props.formRegister("name", { required: true, maxLength: 30 })} className="input input-bordered w-full max-w-xs" />
            {props.errors.name && 
              <div role="alert" className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Error! This field is missing.</span>
              </div>
            }
          </div>
          <div className="w-full">
            <div className="label"><span className="label-text">Due Date</span></div>
            <Controller
              control={props.control}
              name="dueDate"
              render={({ field }) => (
                <DatePicker selected={field.value} minDate={new Date()} onChange={(date) => field.onChange(date)} className="input input-bordered w-full max-w-xs"/>
              )}
            />
          </div>
        </>
        : <div className="w-full flex justify-center"><span className="loading loading-spinner loading-lg h-18"></span></div>
      }
      </div>
    </div>
  )
}
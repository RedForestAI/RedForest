"use client";

import { Profile, Assignment, Role, Activity } from "@prisma/client";
import AssignmentSettings from "./assignment-settings";
import AssignmentStructure from "./assignment-structure";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type SettingsInputs = {
  name: string
  dueDate: Date
}

type FormProps = {
  courseId: string
  assignment: Assignment
  activities: Activity[]
}

export default function AssignmentForm(props: FormProps) {

  // State
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment>(props.assignment);
  const [activities, setActivities] = useState<Activity[]>(props.activities);
  const forms = {
    settings: useForm<SettingsInputs>(),
    structure: useForm<StructureIniputs>()
  }

  // Mutations
  const deleteMutation = api.assignment.delete.useMutation();
  const updateMutation = api.assignment.updateSettings.useMutation();

  useEffect(() => {
    forms.settings.reset({ ...assignment})
  }, [assignment]);

  const settingsSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    console.log(data);
    try {
      await updateMutation.mutateAsync({id: assignment.id, name: data.name, dueDate: data.dueDate, published: false});
    } catch {
      console.log("Failed to update assignment")
    }
  }

  const deleteFunction = async () => {
    // Delete the assignment from the database
    try {
      await deleteMutation.mutateAsync({id: assignment.id});
      router.push(`/access/course/${props.courseId}`)
      router.refresh();
    } catch {
      console.log("Failed to delete assignment")
    }
  }

  const saveFunction = async () => {
    console.log("Submitting all forms")
    await forms.settings.handleSubmit(settingsSubmit)();
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
      router.push(`/access/course/${props.courseId}`)
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
  <p>Hello</p>
  return (
    <form onSubmit={submitAllForms} className="flex flex-col gap-8">
      <AssignmentSettings assignment={assignment} formRegister={forms.settings.register} control={forms.settings.control} errors={forms.settings.formState.errors}/>
      <AssignmentStructure assignment={assignment} activities={activities} setActivities={setActivities}/>
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
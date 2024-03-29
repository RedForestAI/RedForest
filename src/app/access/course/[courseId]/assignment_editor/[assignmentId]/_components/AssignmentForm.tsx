"use client";

import { Profile, Assignment, Question, Activity } from "@prisma/client";
import AssignmentSettings from "./AssignmentSettings";
import AssignmentStructure from "./AssignmentStructure";

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
  questions: Question[][]
}

export default function AssignmentForm(props: FormProps) {

  // State
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[][]>(props.questions);
  const [assignment, setAssignment] = useState<Assignment>(props.assignment);
  const [activities, setActivities] = useState<Activity[]>(props.activities);
  const forms = {
    settings: useForm<SettingsInputs>(),
  }

  // Mutations
  const deleteMutation = api.assignment.delete.useMutation();
  const updateMutation = api.assignment.updateSettings.useMutation();
  const updateIndexMutation = api.activity.updateIndex.useMutation();
  const publishMutation = api.assignment.publish.useMutation();

  useEffect(() => {
    forms.settings.reset({ ...assignment})
  }, [assignment]);

  const settingsSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    try {
      await updateMutation.mutateAsync({id: assignment.id, name: data.name, dueDate: data.dueDate, published: false});
    } catch {
      console.error("Failed to update assignment")
    }
  }

  const structureSubmit = async () => {
    // First iterate through the activities and update their indices
    for (let i = 0; i < activities.length; i++) {
      if (activities[i]) {
        try {
          await updateIndexMutation.mutateAsync({id: activities[i]!.id, index: i});
        } catch {
          console.error("Failed to update activity index")
        }
      }
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
    await structureSubmit();

    if (forms.settings.formState.errors?.name) {
      console.log("Errors in form")
      console.log(forms.settings.formState.errors)
      return false;
    }

    console.log("No errors in form")
    return true;
  }

  const publishFunction = async () => {
    const success = await saveFunction();

    if (success) {
      // Publish the assignment
      try {
        await publishMutation.mutateAsync({id: assignment.id});
      } catch {
        console.log("Failed to publish assignment")
      }
    }

    return success
  }

  const submitAllForms = async (e: any) => {
    e.preventDefault()

    // Determine what button was pressed and which action to perform
    const action = e.nativeEvent.submitter.value;

    if (action === "Delete") {
      await deleteFunction();
      return;
    }
    else if (action === "Save") {
      await saveFunction();
      return;
    }
    else if (action === "Save&Close") {
      const success = await saveFunction();
      if (success) {
        router.push(`/access/course/${props.courseId}`)
        router.refresh();
      }
      return;
    }
    else if (action === "Publish") {
      const success = await publishFunction()
      if (success) {
        router.push(`/access/course/${props.courseId}`)
        router.refresh();
      }
      return;
    }
    else {
      console.warn("Unknown action")
      return;
    }
  }

  return (
    <form onSubmit={submitAllForms} className="flex flex-col gap-8">
      <AssignmentSettings assignment={assignment} formRegister={forms.settings.register} control={forms.settings.control} errors={forms.settings.formState.errors}/>
      <AssignmentStructure assignment={assignment} activities={activities} questions={questions} setQuestions={setQuestions} setActivities={setActivities} saveFunction={saveFunction}/>
      <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <button className="btn btn-error text-white" name="action" value="Delete">Delete</button>
        <div className="flex flex-row gap-2.5">
          <button className="btn btn-info" name="action" value="Save">Save</button>
          <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
          <button className="btn btn-success text-white" name="action" value="Publish">Publish</button>
        </div>
      </div>
    </form>
  )
}
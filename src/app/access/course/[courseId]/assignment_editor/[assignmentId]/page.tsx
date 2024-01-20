"use client";

import { Profile, Assignment, Role, Activity } from "@prisma/client";

import NavBar from "~/components/ui/navbar";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import AssignmentSettings from "./_components/assignment-settings";
import AssignmentStructure from "./_components/assignment-structure";
import { api } from "~/trpc/react";

type SettingsInputs = {
  name: string
  dueDate: Date
}

export default function Page({params}: {params: { courseId: string, assignmentId: string }}) {
  const router = useRouter();
  
  // Queries
  const profileQuery = api.auth.getProfile.useQuery({}, {enabled: false})
  const assignmentQuery = api.assignment.getOne.useQuery({id: params.assignmentId}, {enabled: false});
  const activitiesQuery = api.activity.get.useQuery({assignmentId: params.assignmentId}, {enabled: false})

  // Mutations
  const deleteMutation = api.assignment.delete.useMutation();
  const updateMutation = api.assignment.updateSettings.useMutation();
  
  // State
  const [profile, setProfile] = useState<Profile>();
  const [assignment, setAssignment] = useState<Assignment>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const forms = {
    assignmentSettings: useForm<SettingsInputs>()
  }

  useEffect(() => {

    const fetchProfile = async () => {
      const result = await profileQuery.refetch();
      if (result.error || !result.data) {
        console.log(result.error)
        return;
      }
      else {
        setProfile(result.data);
      }

      if (result.data.role !== Role.TEACHER) {
        router.push(`/access/course/${params.courseId}`)
      }
    }
    fetchProfile();

    const fetchAssignment = async () => {
      const result = await assignmentQuery.refetch();
      if (result.error || !result.data) {
        console.log(result.error)
        return;
      }
      else {
        setAssignment(result.data);
      }

      if (result.data.courseId !== params.courseId) {
        router.push(`/access/course/${params.courseId}`)
      }
    }
    fetchAssignment();

    const fetchActivities = async () => {
      const result = await activitiesQuery.refetch();
      console.log(result.data);
      if (result.error || !result.data) {
        console.log(result.error)
        return;
      }
      else {
        // Initially, sort by their index parameter
        result.data.sort((a, b) => a.index - b.index);

        setActivities(result.data);
      }
    }
    fetchActivities();

  }, [])

  useEffect(() => {
    forms.assignmentSettings.reset({ ...assignment})
  }, [assignment]);

  const settingsSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    console.log(data);
    try {
      await updateMutation.mutateAsync({id: params.assignmentId, name: data.name, dueDate: data.dueDate, published: false});
    } catch {
      console.log("Failed to update assignment")
    }
  }

  const deleteFunction = async () => {
    // Delete the assignment from the database
    try {
      await deleteMutation.mutateAsync({id: params.assignmentId});
      router.push(`/access/course/${params.courseId}`)
      router.refresh();
    } catch {
      console.log("Failed to delete assignment")
    }
  }

  const saveFunction = async () => {
    console.log("Submitting all forms")
    await forms.assignmentSettings.handleSubmit(settingsSubmit)();
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
      router.push(`/access/course/${params.courseId}`)
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
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="pt-20 items-stretch bg-zinc-900 flex flex-col px-5 py-11 max-md:px-5">
      <form onSubmit={submitAllForms} className="flex flex-col gap-8">
        <AssignmentSettings assignment={assignment} formRegister={forms.assignmentSettings.register} control={forms.assignmentSettings.control} errors={forms.assignmentSettings.formState.errors}/>
        <AssignmentStructure activities={activities} setActivities={setActivities}/>
        <div className="justify-between items-stretch flex mt-8 mb-8 pl-10 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
          <button className="btn btn-error" name="action" value="Delete">Delete</button>
          <div className="flex flex-row gap-2.5">
            <button className="btn btn-info" name="action" value="Save">Save</button>
            <button className="btn btn-info" name="action" value="Save&Close">Save & Close</button>
            <button className="btn btn-success" name="action" value="Publish">Publish</button>
          </div>
        </div>
      </form>
    </div>
    </div>
  )
};

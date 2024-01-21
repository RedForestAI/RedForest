"use client";

import { Profile, Course } from "@prisma/client";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { courseRouter } from "~/server/api/routers/course";

type AssignmentCreateProps = {
  course: Course
  profile: Profile
}

export default function AssignmentCreate( props: AssignmentCreateProps) {
  const router = useRouter();
  const mutation = api.assignment.createEmpty.useMutation();

  const createAssignment = async () => {
    try {
      const result = await mutation.mutateAsync({courseId: props.course.id});
      router.push(`../../access/course/${props.course.id}/assignment_editor/${result.id}`)
    } catch {
      console.log("Failed to create assignment")
    }
    
  }

  return (
    <>
      <button onClick={createAssignment} className="w-full" type="button">
        <div className="justify-center items-center bg-base-300 flex flex-col px-16 py-8 rounded-2xl border-[3px] border-solid max-md:px-5 mt-4 h-38">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </button>
    </>
  )
}

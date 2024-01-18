"use client";
import { useRouter } from "next/navigation";
import { api } from '~/trpc/react';

type ActionButtonProps = {
  courseId: string
  assignmentId: string
}

export default function ActionButtons(props: ActionButtonProps) {
  const router = useRouter();
  const mutation = api.assignment.delete.useMutation();

  const saveFunction = async () => {
    router.push(`/access/course/${props.courseId}`)
    router.refresh();
  }

  const deleteFunction = async () => {

    // Delete the assignment from the database
    try {
      await mutation.mutateAsync({id: props.assignmentId});
      router.push(`/access/course/${props.courseId}`)
      router.refresh();
    } catch {
      console.log("Failed to delete assignment")
    }
  }

  return (
    <div className="justify-between items-stretch flex gap-2.5 mt-8 mb-8 pl-20 pr-10 py-3 max-md:max-w-full max-md:flex-wrap max-md:px-5">
      <div onClick={saveFunction} className="flex grow basis-[0%] flex-col justify-center items-stretch rounded-2xl cursor-pointer">
        <span className="justify-center text-white text-center text-base bg-orange-600 items-stretch px-7 py-4 rounded-2xl max-md:px-5">
          Save
        </span>
      </div>
      <div onClick={deleteFunction} className="flex grow basis-[0%] flex-col justify-center items-stretch rounded-2xl cursor-pointer">
        <span className="justify-center text-white text-center text-base bg-orange-600 items-stretch px-7 py-4 rounded-2xl max-md:px-5">
          Delete
        </span>
      </div>
      <div className="flex grow basis-[0%] flex-col justify-center items-stretch rounded-2xl">
        <span className="justify-center text-white text-center text-base bg-orange-600 items-stretch px-5 py-4 rounded-2xl max-md:px-5">
          Publish
        </span>
      </div>
    </div>
  )
}
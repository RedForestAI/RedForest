"use client";

import { Course } from "@prisma/client";
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type CourseOptionsProps = {
  course: Course
  teacherId: string
}

export default function CourseOptions( props: CourseOptionsProps) {
  const router = useRouter();
  const deleteMutation = api.course.delete.useMutation()
  const linkQuery = api.course.getInviteLink.useQuery({passwordId: props.course.passwordId, teacherId: props.teacherId}, {enabled: false})

  const deleteCourse = async () => {
    try {
      await deleteMutation.mutateAsync({courseId: props.course.id, teacherId: props.teacherId})
      router.refresh();
    } catch (error: any) {
      console.log(error)
    }
  }

  const copyInviteLink = async () => {

    const result = await linkQuery.refetch();

    if (result.error || !result.data) {
      console.log(result.error)
      return;
    }

    const link = `${origin}/api/enroll?courseId=${props.course.id}&password=${result.data.secret}`;
    navigator.clipboard.writeText(link)
  };


  return (
    <>
      <dialog id={`course_options_modal_${props.course.id}`} className="modal">
        <div className="modal-box">
          <h3 className="text-4xl">Course Settings</h3>

          <div className="self-stretch text-2xl mt-2.5">Settings</div>
          <div className="w-full justify-center whitespace-nowrap items-stretch self-stretch border mt-2.5 px-2.5 rounded-2xl border-solid border-zinc-300">
            {props.course.name}
          </div>

          
          <div className=""> 
            <div className="self-stretch text-2xl mt-2.5">Invitation</div>
            <div className="items-stretch self-stretch flex justify-between gap-2.5 mt-2.5">
              <div className="justify-center whitespace-nowrap items-stretch border grow px-2.5 rounded-2xl border-solid border-zinc-300">
                Email
              </div>
              <div className="flex basis-[0%] flex-col justify-center items-stretch rounded-2xl">
                <span className="justify-center text-center text-secondary-content bg-secondary items-stretch px-7 py-4 rounded-2xl">
                  Invite
                </span>
              </div>
            </div>
            <div onClick={copyInviteLink} className="cursor-pointer justify-center text-center text-secondary-content w-full bg-secondary self-stretch items-center mt-2.5 px-16 py-4 rounded-2xl">
            Copy Invite Link
            </div>
          </div>

          <div className="">
            <div className="self-stretch text-error text-2xl mt-2.5">
              Danger Zone
            </div>
            <div className="items-stretch self-stretch border flex flex-col justify-center mt-2.5 p-2.5 rounded-2xl border-solid border-error">
              <span className="justify-between items-center flex gap-0">
                <div className=" grow shrink basis-auto my-auto">
                  Delete course and all related content. This action cannot be undon.
                </div>
                <div onClick={deleteCourse} className="self-stretch flex basis-[0%] flex-col justify-center items-stretch rounded-2xl cursor-pointer">
                  <div className="justify-center text-center text-white bg-error items-stretch px-6 py-4 rounded-2xl">
                    Delete
                  </div>
                </div>
              </span>
            </div>
          </div>

          <div className="justify-center text-center bg-primary text-primary-content items-stretch mt-12 px-7 py-4 rounded-2xl self-end">
            Save
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
"use client";

import { Profile } from "@prisma/client";
import { useState, useTransition } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type Inputs = {
  courseName: string
}

type CourseCreateProps = {
  profile: Profile
}

export default function CourseCreate( { profile }: CourseCreateProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  let [isOpen, setIsOpen] = useState<boolean>(false)
  let [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function closeModal() {
    setIsOpen(false)
    // @ts-ignore
    document.getElementById('course_modal').close()
  }

  function openModal() {
    setIsOpen(true)
    // @ts-ignore
    document.getElementById('course_modal').showModal()
  }

  const courseMutation = api.course.create.useMutation()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await courseMutation.mutateAsync({name: data.courseName, teacherId: profile.id})
      closeModal()

      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });

    } catch (error: any) {
      setErrorMessage("Failed to create course: " + error?.message)
    }
  }

  return (
    <>
      <button onClick={openModal} className="w-full mt-4" type="button">
        <div className="flex justify-center items-center bg-base-100 border border-neutral px-16 py-8 rounded-2xl max-md:px-5 h-44">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </button>

      <dialog id="course_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-2xl">Create Course</h3>
          <form className="pt-4 pb-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("courseName", { required: true, maxLength: 20 })} placeholder="Course Name" className="w-full rounded-2xl border border-neutral py-1.5 pl-2 pr-20 bg-base-100"/>
            {errors.courseName && <span className="text-rose-500">This field is required or not filled correctly</span>}
            {errorMessage && <span className="text-rose-500">{errorMessage}</span>}

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
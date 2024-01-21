"use client";

import { Profile } from "@prisma/client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useTransition } from 'react'
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
  }

  function openModal() {
    setIsOpen(true)
  }

  const courseMutation = api.course.create.useMutation()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await courseMutation.mutateAsync({name: data.courseName, teacherId: profile.id})
      console.log(data)
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
        <div className="flex justify-center items-center bg-base-300 px-16 py-8 rounded-2xl border-[3px] border-solid max-md:px-5 h-44">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 border-b-4 border-inherit pb-2"
                  >
                    Create Course
                  </Dialog.Title>

                  <form className="pt-4 pb-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("courseName", { required: true, maxLength: 20 })} placeholder="Course Name" className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

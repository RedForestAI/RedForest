"use client";

import { Course, CoursePassword } from "@prisma/client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type CourseOptionsProps = {
  course: Course
  teacherId: string
}

export default function CourseOptions( props: CourseOptionsProps) {
  let [isOpen, setIsOpen] = useState<boolean>(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const router = useRouter();
  const deleteMutation = api.course.delete.useMutation()
  const linkQuery = api.course.getInviteLink.useQuery({passwordId: props.course.passwordId, teacherId: props.teacherId}, {enabled: false})

  const deleteCourse = async () => {
    try {
      await deleteMutation.mutateAsync({courseId: props.course.id, teacherId: props.teacherId})
      setIsOpen(false)
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
      <div className="flex justify-center items-center" onClick={openModal}>
        <FontAwesomeIcon icon={faGear} className='h-8 fa-2x cursor-pointer'/>
      </div>

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-base-100 rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 border-b-4 border-inherit pb-2"
                  >
                    Course Options
                  </Dialog.Title>

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

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

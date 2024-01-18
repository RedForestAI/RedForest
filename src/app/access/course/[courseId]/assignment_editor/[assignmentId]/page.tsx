import { Profile, Assignment, Role } from "@prisma/client";
import { redirect } from "next/navigation";

import NavBar from "~/components/ui/navbar";
import ActionButtons from "./_components/action-buttons";
import { api } from '~/trpc/server';

export default async function Page({params}: {params: { courseId: string, assignmentId: string }}) {

  const profile: Profile = await api.auth.getProfile.query();

  // First check that this profile is a teacher of the course
  if (profile.role !== Role.TEACHER) {
    redirect(`/access/course/${params.courseId}`)
  }

  const assignment: Assignment = await api.assignment.getOne.query({id: params.assignmentId});

  const getAssignmentName = () => {
    if (!assignment.published) {
      return `${assignment.name} (Draft)`
    }
    return assignment.name
  }

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="pt-20 items-stretch bg-zinc-900 flex flex-col px-5 py-11 max-md:px-5">
      <div className="justify-center bg-white bg-opacity-0 flex flex-col pt-1.5 pb-4 px-3.5 items-start max-md:max-w-full">
        <span className="text-white text-center text-base whitespace-nowrap justify-center items-stretch bg-stone-900 z-[1] ml-5 px-1.5 max-md:ml-2.5">
          Assignment Information
        </span>
        <div className="items-stretch self-stretch flex flex-col p-8 rounded-2xl border-[3px] border-solid border-white max-md:max-w-full max-md:px-5">
          <span className="justify-center text-white text-base items-stretch border px-2.5 rounded-2xl border-solid border-zinc-300 max-md:max-w-full">
            {getAssignmentName()}
          </span>
          <span className="justify-center text-white text-base items-stretch border mt-8 px-2.5 rounded-2xl border-solid border-zinc-300 max-md:max-w-full">
            {assignment.dueDate.toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="justify-center bg-white bg-opacity-0 flex flex-col mt-2.5 pt-1.5 pb-4 px-3.5 items-start max-md:max-w-full">
        <span className="text-white text-center text-base whitespace-nowrap justify-center items-stretch bg-stone-900 z-[1] ml-5 px-1.5 max-md:ml-2.5">
          Assignment Structure
        </span>
        <div className="items-stretch self-stretch flex flex-col p-8 rounded-2xl border-[3px] border-solid border-white max-md:max-w-full max-md:px-5">
          <div className="items-center border flex gap-1.5 pl-2.5 rounded-2xl border-solid border-white max-md:max-w-full max-md:flex-wrap">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac022945ea284c82f5bda060a549639c6cc9159065772ef45cabcfbc119539ee?apiKey=73d2c283fced4cf3a7555601270c1cc1&"
              className="aspect-[1.02] object-contain object-center w-[61px] overflow-hidden shrink-0 max-w-full my-auto"
            />
            <div className="self-stretch bg-zinc-300 flex w-px shrink-0 h-[85px] flex-col" />
            <span className="items-stretch self-stretch flex justify-between gap-1.5 px-1.5 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
              <span className="items-stretch flex grow basis-[0%] flex-col py-2 max-md:max-w-full">
                <div className="text-white text-2xl max-md:max-w-full">
                  Activity Name
                </div>
                <div className="text-white text-xs mt-1.5 max-md:max-w-full">
                  Activity Description and details
                </div>
              </span>
              <div className="justify-center text-white text-center text-2xl grow whitespace-nowrap">
                5pts
              </div>
            </span>
          </div>
          <div className="items-center border flex gap-1.5 mt-8 pl-2.5 rounded-2xl border-solid border-white max-md:max-w-full max-md:flex-wrap">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac022945ea284c82f5bda060a549639c6cc9159065772ef45cabcfbc119539ee?apiKey=73d2c283fced4cf3a7555601270c1cc1&"
              className="aspect-[1.02] object-contain object-center w-[61px] overflow-hidden shrink-0 max-w-full my-auto"
            />
            <div className="self-stretch bg-zinc-300 flex w-px shrink-0 h-[85px] flex-col" />
            <span className="items-stretch self-stretch flex justify-between gap-1.5 px-1.5 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
              <span className="items-stretch flex grow basis-[0%] flex-col py-2 max-md:max-w-full">
                <div className="text-white text-2xl max-md:max-w-full">
                  Activity Name
                </div>
                <div className="text-white text-xs mt-1.5 max-md:max-w-full">
                  Activity Description and details
                </div>
              </span>
              <div className="justify-center text-white text-center text-2xl grow whitespace-nowrap">
                5pts
              </div>
            </span>
          </div>
          <div className="items-center border flex gap-1.5 mt-8 pl-2.5 rounded-2xl border-solid border-white max-md:max-w-full max-md:flex-wrap">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac022945ea284c82f5bda060a549639c6cc9159065772ef45cabcfbc119539ee?apiKey=73d2c283fced4cf3a7555601270c1cc1&"
              className="aspect-[1.02] object-contain object-center w-[61px] overflow-hidden shrink-0 max-w-full my-auto"
            />
            <div className="self-stretch bg-zinc-300 flex w-px shrink-0 h-[85px] flex-col" />
            <span className="items-stretch self-stretch flex justify-between gap-1.5 px-1.5 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
              <span className="items-stretch flex grow basis-[0%] flex-col py-2 max-md:max-w-full">
                <div className="text-white text-2xl max-md:max-w-full">
                  Activity Name
                </div>
                <div className="text-white text-xs mt-1.5 max-md:max-w-full">
                  Activity Description and details
                </div>
              </span>
              <div className="justify-center text-white text-center text-2xl grow whitespace-nowrap">
                5pts
              </div>
            </span>
          </div>
          <div className="justify-center items-center border flex flex-col mt-8 px-16 py-6 rounded-2xl border-solid border-emerald-50 max-md:max-w-full max-md:px-5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/290f9aac3c0bc31dfbec86b30179bad5fe5cc1cc5bbb79f2a5ac70a19827c9d8?apiKey=73d2c283fced4cf3a7555601270c1cc1&"
              className="aspect-square object-contain object-center w-[41px] overflow-hidden max-w-full"
            />
          </div>
        </div>
      </div>
      <ActionButtons courseId={params.courseId} assignmentId={params.assignmentId}/>
    </div>
    </div>
  )
};

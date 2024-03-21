"use server";

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { Profile } from "@prisma/client";
import NavBar from '~/components/ui/NavBar';
import OpenTabIconButton from '@/components/ui/OpenTabIconButtons';
import { api } from '~/trpc/server';

import Panda from "~/components/avatar/Panda";

export default async function Page() {

  // Fetch data
  let profile: Profile | null = null;

  try {
    profile = await api.auth.getProfile.query();
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <div className="flex flex-col justify-between">
        <NavBar profile={profile}/>

        <div className="w-full mt-[10vh]">
          <div className="flex sm:flex-col md:flex-row w-full pl-[10vw] pr-[10vw]" style={{"height": "80vh"}}>
            <div className="flex flex-col sm:w-full md:w-1/4 items-center justify-center">
              <h1 className="text-7xl font-bold">Hello, I'm Bambu</h1>
              <p className="py-[3vh]">I will be your personal assistance throughout your educational journey, both for teachers and students.</p>
            </div>
            <div className="sm:w-full md:w-3/4 md:h-[75vh] md:max-h-[75vw]">
              <Panda action={"Rig|Sit"}/>
            </div>
          </div>
        </div>
          
      </div>
    </>
  );
};

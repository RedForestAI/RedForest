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

        <div className="hero">
          <div className="hero-content flex flex-row pl-[10vw] pr-[10vw]" style={{"height": "80vh"}}>
            <div>
              <h1 className="text-7xl font-bold">Hello, I'm Bambu</h1>
              <p className="py-[6vw] text-content-300">I will be your personal assistance throughout your educational journey, both for teachers and students.</p>
            </div>
            <Panda action={"Rig|Sit"}/>
          </div>
        </div>
          
      </div>
    </>
  );
};

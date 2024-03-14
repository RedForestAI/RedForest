"use server";

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { Profile } from "@prisma/client";
import NavBar from '@/components/ui/navbar';
import OpenTabIconButton from '@/components/ui/open-tab-icon-buttons';
import { api } from '~/trpc/server';

import GreetingPanda from "./_components/GreetingPanda";

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
      <div className="min-h-screen flex flex-col justify-between">
        <NavBar profile={profile}/>
        <div className="h-full flex-1">

          <div className="h-96">
            <GreetingPanda />
          </div>
          
          <div className="mt-8 text-center w-full flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Welcome to RedForest</h1>
            <p className="mt-4 text-xl">Your AI-Powered Classroom Assistant</p>

            <div className="mt-20 text-center">
              <h2 className="text-2xl font-semibold">Our Goal</h2>
              <p className="mt-4 text-lg max-w-96">
                RedForest is dedicated to bringing AI via eye-tracking to the classroom.
                We help teachers understand how students perform in assignments, making education more effective.
              </p>
            </div>
          </div>

        </div>

        <footer className="footer p-10 bg-neutral text-neutral-content">
          <aside>
            <img src="/imgs/banner.png" width="300px"/>
          </aside>
          <nav>
            <h6 className="footer-title">Social</h6> 
            <div className="grid grid-flow-col gap-4">
              <OpenTabIconButton icon={faEnvelope} url="mailto:contact.redforest.ai@gmail.com" />
              <OpenTabIconButton icon={faGithub} url="https://github.com/reading-analytics-group/RedForest" />
            </div>
          </nav>
          </footer>
      </div>
    </>
  );
};

"use server";

import { Profile } from "@prisma/client";
import NavBar from '@/components/ui/navbar';
import OpenTabIconButton from '@/components/ui/open-tab-icon-buttons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { api } from '~/trpc/server';

export default async function Page() {

  // Fetch data
  let profile: Profile | null = null;
  try {
    profile = await api.auth.getProfile.query();
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <NavBar profile={profile}/>
      <div className="h-screen flex flex-col justify-center items-center bg-base">
        <header className="mt-8 text-center">
          <h1 className="text-4xl font-bold">Welcome to RedForest</h1>
          <p className="mt-4 text-xl">Your AI-Powered Classroom Assistant</p>
        </header>

        <section className="mt-64 text-center max-w-lg">
          <h2 className="text-2xl font-semibold">Our Goal</h2>
          <p className="mt-4 text-lg">
            RedForest is dedicated to bringing AI via eye-tracking to the classroom.
            We help teachers understand how students perform in assignments, making education more effective.
          </p>
        </section>

        <section className="mt-auto text-center pb-16">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <div className="mt-4 flex justify-center space-x-6">
            <OpenTabIconButton icon={faEnvelope} url="mailto:contact.redforest.ai@gmail.com" />
            <OpenTabIconButton icon={faGithub} url="https://github.com/reading-analytics-group/RedForest" />
          </div>
        </section>
      </div>
    </div>
  );
};

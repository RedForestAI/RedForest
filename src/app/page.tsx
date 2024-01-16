"use server";

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import NavBar from '@/components/ui/navbar';
import OpenTabIconButton from '@/components/ui/open-tab-icon-buttons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default async function HomePage() {

  // Fetch data
  // const cookieStore = cookies()
  // const supabase = createServerComponentClient({ cookies: () => cookieStore })
  // const { data } = await supabase.auth.getSession();
  // console.log(data);

  return (
    <div>
      <NavBar includeBurger={false} accountLink={"session/login"} logoLink={"/"} />
      <div className="h-screen flex flex-col justify-center items-center bg-zinc-950">
        <header className="mt-8 text-white text-center">
          <h1 className="text-4xl font-bold">Welcome to RedForest</h1>
          <p className="mt-4 text-xl">Your AI-Powered Classroom Assistant</p>
        </header>

        <section className="mt-64 text-white text-center max-w-lg">
          <h2 className="text-2xl font-semibold">Our Goal</h2>
          <p className="mt-4 text-lg">
            RedForest is dedicated to bringing AI via eye-tracking to the classroom.
            We help teachers understand how students perform in assignments, making education more effective.
          </p>
        </section>

        <section className="mt-auto text-white text-center pb-16">
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

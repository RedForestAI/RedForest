// pages/index.js
"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import NavBar from '@/components/NavBar';

const HomePage = () => {

  const navLinks = [
    { id: 1, link: "/auth/login", title: "Login" },
  ];

  const openInNewTab = (url: string) => {
      window.open(url, "_blank", "noreferrer");
    };

  return (
    <div>
      <NavBar links={navLinks} />
      <div className="h-screen flex flex-col justify-center items-center">
        <header className="mt-8 text-white text-center">
          <h1 className="text-4xl font-bold">Welcome to SandCastleReader</h1>
          <p className="mt-4 text-xl">Your AI-Powered Classroom Assistant</p>
        </header>

        <section className="mt-64 text-white text-center max-w-lg">
          <h2 className="text-2xl font-semibold">Our Goal</h2>
          <p className="mt-4 text-lg">
            SandCastleReader is dedicated to bringing AI via eye-tracking to the classroom.
            We help teachers understand how students perform in assignments, making education more effective.
          </p>
        </section>

        <section className="mt-auto text-white text-center pb-16">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <div className="mt-4 flex justify-center space-x-6">
            <FontAwesomeIcon icon={faEnvelope} onClick={() => openInNewTab('mailto:sandcastlereader@gmail.com')}/>
            <FontAwesomeIcon icon={faGithub} onClick={() => openInNewTab("https://github.com/reading-analytics-group/SandCastleReader")}/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

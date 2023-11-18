// pages/index.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'; // Import from free-brands-svg-icons

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <header className="text-white text-center">
        <h1 className="text-4xl font-bold">Welcome to SandCastleReader</h1>
        <p className="mt-4 text-xl">Your AI-Powered Classroom Assistant</p>
      </header>

      <section className="mt-8 text-white text-center max-w-lg">
        <h2 className="text-2xl font-semibold">Our Goal</h2>
        <p className="mt-4 text-lg">
          SandCastleReader is dedicated to bringing AI via eye-tracking to the classroom.
          We help teachers understand how students perform in assignments, making education more effective.
        </p>
      </section>

      <section className="mt-auto text-white text-center p-8">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="mailto:sandcastlereader@gmail.com" className="text-3xl">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://github.com/reading-analytics-group/SandCastleReader" target="_blank" className="text-3xl">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

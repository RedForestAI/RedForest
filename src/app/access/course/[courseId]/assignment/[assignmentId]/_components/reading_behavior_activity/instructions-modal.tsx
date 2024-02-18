import React, { useEffect } from 'react';

type InstructionsModalProps = {
  runningET: boolean;
  setInInstructions: (inInstructions: boolean) => void;
}

export default function InstructionsModal(props: InstructionsModalProps) {

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[60]">
      <div className="mt-20 w-[50%] h-[35%] m-auto">
        <div className="flex flex-col h-full items-center bg-base-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold pb-12 text-5xl">Getting Ready!</h1>
          <h1 className="h-5/6 text-xl">Before starting the activity, get comfortable and setup the eye-tracking solution. Once you are ready and all settled, press Continue.</h1>
          <button className="btn btn-primary" disabled={!props.runningET} onClick={() => {props.setInInstructions(false)}}>Continue</button>
        </div>
      </div>
    </div>
  );
}
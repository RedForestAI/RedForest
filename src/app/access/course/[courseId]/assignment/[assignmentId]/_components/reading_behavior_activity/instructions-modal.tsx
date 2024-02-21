import React, { useEffect } from "react";

type InstructionsModalProps = {
  runningET: boolean;
  setInInstructions: (inInstructions: boolean) => void;
};

export default function InstructionsModal(props: InstructionsModalProps) {
  return (
    <div className="fixed left-0 top-[30%] z-[60] h-full w-full">
      <div className="m-auto h-[35%] w-[50%]">
        <div className="flex flex-col h-full items-center bg-base-100 border border-neutral rounded-2xl overflow-hidden p-4">
          <h1 className="pb-12 text-2xl text-5xl font-bold">Getting Ready!</h1>
          <h1 className="h-5/6 text-xl">
            Before starting the activity, get comfortable and setup the
            eye-tracking solution. In this activity, you will be performing
            various types of reading behaviors. This is to calibrate our system
            to be able to recognize your reading patterns for future readings.
            Once you are ready and all settled, press Continue.
          </h1>
          <button
            className="btn btn-primary"
            disabled={!props.runningET}
            onClick={() => {
              props.setInInstructions(false);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

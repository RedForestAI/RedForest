import React, { useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { faCircleQuestion, faEye } from '@fortawesome/free-solid-svg-icons';
import { useEndNavBarContext } from '~/providers/NavbarProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { triggerActionLog } from "~/loggers/ActionsLogger";

import Panda from '~/components/avatar/Panda';

type InstructionsModalProps = {
  inInstructions: boolean;
  runningET: boolean;
  setInInstructions: (inInstructions: boolean) => void;
};

export default function InstructionsModal(props: InstructionsModalProps) {

  const setEndNavBarContent = useContext(useEndNavBarContext);

  useEffect(() => {
    const endNavBarExtras = (
      <div className="">
        <button className="btn btn-ghost" onClick={openModal}>
          <FontAwesomeIcon icon={faCircleQuestion} className="fa-2x" />
        </button>
      </div>
    )

    // Append instead of replace
    setEndNavBarContent((prev: any) => { 
      if (prev){
        return (
          <>
            {endNavBarExtras}
            {prev}
          </>
        )
      }
      else {
        return endNavBarExtras;
      }
      }
     );

    return () => setEndNavBarContent(null);
  }, []);

  function openModal() {
    // props.setOpen(true);
    props.setInInstructions(true);
    triggerActionLog({ type: "instructionOpen", value: {} });
  }

  function closeModal() {
    // props.setOpen(false);
    props.setInInstructions(false);
    triggerActionLog({ type: "instructionClose", value: {} });
    // props.onContinue();
  }

  const ratio = 0.5
  const opts = {
    width: `${ratio * 1920}`,
    height: `${ratio * 1080}`,
  };

  return (
    <>
    {props.inInstructions &&
      <div className="fixed left-0 top-[10%] z-[70] h-full w-full">
        <div className="m-auto h-[85%] w-[85%]">
          <div className="flex flex-col h-full items-center bg-base-100 border border-neutral rounded-2xl overflow-y-auto p-4">
            <h1 className="pb-4 text-2xl text-5xl font-bold">Learning How You Read</h1>

            <div className="flex sm:flex-col md:flex-row w-full">
              <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl md:w-1/2 sm:w-full pt-6 pb-4 ml-12 mr-12 flex flex-col gap-4">
                <p>Can our AI system learn to recognize your reading?</p>
                <p>Help teach it by training it to recognize how you read!</p>
                <p>To teach it, you will
                  <ul className="pl-[3vw]">
                    <li style={{listStyle: "square"}}>Read a passage</li>
                    <li style={{listStyle: "square"}}>Answer questions about the passage</li>
                    <li style={{listStyle: "square"}}>Complete a short survey</li>
                  </ul>
                </p>
                <p>Let's see if the computer can be trained. Let's read.</p>
                <p>
                  Before starting, start the eye-tracking solution by the top-right {" "}
                  <span>
                    <FontAwesomeIcon icon={faEye} className="fa" />
                  </span> icon. {" "} 
                </p>
              </div>

              <div className="md:w-1/2 sm:w-full md:h-[50vh] md:max-h-[40vw]">
                <Panda action={"Rig|Idle"}/>
              </div>

            </div>
            <button
              className="btn btn-primary"
              disabled={!props.runningET}
              onClick={closeModal}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    }
    </>
  );
}

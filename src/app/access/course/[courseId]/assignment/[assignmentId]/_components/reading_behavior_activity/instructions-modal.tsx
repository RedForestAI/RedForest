import React, { useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { useEndNavBarContext } from '~/providers/navbar-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { triggerActionLog } from "~/loggers/actions-logger";

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
        <div className="m-auto h-[60%] w-[70%]">
          <div className="flex flex-col h-full items-center bg-base-100 border border-neutral rounded-2xl overflow-hidden p-4">
            <h1 className="pb-4 text-2xl text-5xl font-bold">Learning How You Read</h1>
            
            {/* <YouTube opts={opts} videoId="YR6HecNZg10" /> */}
            <div className="player-wrapper">
              <ReactPlayer className="react-player" width='100%' height='100%' url="https://www.youtube.com/watch?v=uIWvigp8OBQ"/>
            </div>
            
            <div className="h-4/6 text-xl pt-6 pb-4 ml-12 mr-12 flex flex-col gap-4">
              <p>Can our AI system learn to recognize your reading?</p>
              <p>Help teach it by training it to recognize how you read!</p>
              <p>To teach it, you will
                <ul className="pl-6">
                  <li style={{listStyle: "square"}}>Read a passage</li>
                  <li style={{listStyle: "square"}}>Answer questions about the passage</li>
                  <li style={{listStyle: "square"}}>Complete a short survey</li>
                </ul>
              </p>
              <p>Let's see if the computer can be trained. Let's read.</p>
              <p>Before starting, start the eye-tracking solution by the top-right eye icon.</p>
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

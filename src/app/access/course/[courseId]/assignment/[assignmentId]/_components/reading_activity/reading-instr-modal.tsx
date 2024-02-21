import { useContext, useEffect } from 'react';
import YouTube from 'react-youtube';
import { faCircleQuestion, faClose } from '@fortawesome/free-solid-svg-icons';
import { useEndNavBarContext } from '~/providers/navbar-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { triggerActionLog } from "~/loggers/actions-logger";

// Create a instruction modal for the PDF Viewer
export default function ReadingInstrModal(props: { open: boolean, setOpen: (e: boolean) => void, onContinue: () => void }) {

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
    props.setOpen(true);
    triggerActionLog({ type: "instructionOpen", value: {} });
  }

  function closeModal() {
    props.setOpen(false);
    triggerActionLog({ type: "instructionClose", value: {} });
    props.onContinue();
  }

  const ratio = 0.5
  const opts = {
    width: `${ratio * 1920}`,
    height: `${ratio * 1080}`,
  };

  return (
    <>
    {props.open &&
      <div className="fixed top-[10%] left-0 w-full h-full z-[70]">
        <div className="w-[70%] h-[60%] m-auto">
          <div className="flex flex-col h-full items-center justify-between bg-base-100 border border-neutral rounded-2xl overflow-hidden p-4">
          <h1 className="text-2xl font-bold pb-2 text-5xl">Getting Ready!</h1>
            {/* YouTube Video */}
            <YouTube opts={opts} videoId="YR6HecNZg10" />
            <h1 className="text-3xl">Before starting the activity, get comfortable and setup the eye-tracking solution. Once you are ready and all settled, press Continue.</h1>
            <button className="btn btn-primary" onClick={closeModal}>Continue</button>
          </div>
        </div>
      </div>
    }
    </>
  )
}
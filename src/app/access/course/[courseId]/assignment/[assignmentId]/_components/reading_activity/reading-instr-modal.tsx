import { useContext, useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { useEndNavBarContext } from "~/providers/navbar-provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { triggerActionLog } from "~/loggers/actions-logger";

// Create a instruction modal for the PDF Viewer
export default function ReadingInstrModal(props: {
  open: boolean;
  setOpen: (e: boolean) => void;
  onContinue: () => void;
  runningET: boolean;
}) {
  const setEndNavBarContent = useContext(useEndNavBarContext);

  useEffect(() => {
    const endNavBarExtras = (
      <div className="">
        <button className="btn btn-ghost" onClick={openModal}>
          <FontAwesomeIcon icon={faCircleQuestion} className="fa-2x" />
        </button>
      </div>
    );

    // Append instead of replace
    setEndNavBarContent((prev: any) => {
      if (prev) {
        return (
          <>
            {endNavBarExtras}
            {prev}
          </>
        );
      } else {
        return endNavBarExtras;
      }
    });

    return () => setEndNavBarContent(null);
  }, []);

  function openModal() {
    props.setOpen(true);
    triggerActionLog({ type: "instructionOpen", value: {} });
  }

  function closeModal(funProps: { areYouSure: boolean }) {

    // Make sure the eye-tracking is running
    if (!props.runningET && !funProps.areYouSure) {
      // @ts-ignore
      document.getElementById("are_you_sure_modal").showModal();
      return;
    }

    props.setOpen(false);
    triggerActionLog({ type: "instructionClose", value: {} });
    props.onContinue();
  }

  const ratio = 0.5;
  const opts = {
    width: `50%`,
    height: ``,
  };

  return (
    <>
      {props.open && (
        <>
          <div className="fixed left-0 top-[10%] z-[70] h-full w-full">
            <div className="m-auto h-[60%] w-[70%]">
              <div className="flex h-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-neutral bg-base-100 p-4">
                <h1 className="pb-2 text-2xl text-5xl font-bold">
                  Getting Ready!
                </h1>
                {/* YouTube Video */}
                <div className="player-wrapper">
                  <ReactPlayer className="react-player" width='100%' height='100%' url="https://www.youtube.com/watch?v=YR6HecNZg10&feature=youtu.be"/>
                </div>
                <h1 className="text-3xl">
                  Before starting the activity, get comfortable and setup the
                  eye-tracking solution. Once you are ready and all settled, press
                  Continue.
                </h1>
                <button className="btn btn-primary" onClick={() => {
                  closeModal({ areYouSure: false});
                }}>
                  Continue
                </button>
              </div>
            </div>
          </div>

          <dialog id="are_you_sure_modal" className="modal z-[100]">
            <div className="modal-box">
              <h3 className="font-bold text-2xl">All ready?</h3>
              <p className="py-4 text-xl">You haven't setup your eye-tracker. Are you sure you want to start the activity?</p>
              <div className="modal-action w-full flex flex-row justify-between">
                <form method="dialog">
                  <button className="btn bg-success text-white" onClick={() => {
                    closeModal({ areYouSure: true});
                  }}>Yes</button>
                </form>
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn bg-error text-white">No</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
}

import { useContext, useEffect, useState } from "react";
import { driver, DriveStep } from "driver.js";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEndNavBarContext } from "~/providers/NavbarProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { triggerActionLog } from "~/loggers/ActionsLogger";

import 'driver.js/dist/driver.css'
import './driverjs_theme.css'

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
      <div id="instructions-question"> 
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

  function runTutorial() {
    props.setOpen(false);
    let steps: DriveStep[] = [
      { element: "#zoom-controls", popover: { title: "Zoom Control", description: "You can zoom in and out of the document using these buttons." } },
      { element: "#task-tray", popover: { title: "Task Tray", side: "left", align: "center", description: "Click on the TASK TRAY to access the questions after finish reading the passage(s)." } },
    ]

    // Get element for the document drawer
    const drawer = document.getElementById("DocumentPane");
    if (drawer) {
      steps.push({ element: "#DocumentPane", popover: { title: "Document Tray", side: "right", align: "center", description: "Click on the DOC TRAY to access the documents." } });
    }

    steps.push({ popover: { title: "Highlighting", description: "<div class='gif-popover' style='width: 40vw'><img style='max-width: 100%' src='/gifs/highlight.gif' /><p style='font-size: x-large'>You can highlight text. To remove a highlight, re-highlighting the same text selection.</p></div>" } });
    steps.push({ popover: { title: "Annotate", description: "<div class='gif-popover' style='width: 40vw'><img style='max-width: 100%' src='/gifs/annotate.gif' /><p style='font-size: x-large'>You can annotate (make notes) while you read. Make sure to save your notes by pressing the `Save` button.</p></div>" }});
    steps.push({ popover: { title: "Dictionary", description: "<div class='gif-popover' style='width: 40vw'><img style='max-width: 100%' src='/gifs/dictionary.gif' /><p style='font-size: x-large'>To look up words, select a word and press the `LookUp` button. A dictionary entry should popup in the bottom right.</p></div>" }});
    steps.push({ element: "#eye-tracking-button", popover: { title: "Eye-Tracking", description: "To setup up eye-tracking, click here." } });
    steps.push({ element: "#instructions-question", popover: { title: "Instructions & Tutorial", description: "If you ever need to revisit these tutorial/instructions, click here." } })

    const driverObj = driver({
      showProgress: true,
      steps: steps,
      onDestroyed: () => {
        props.setOpen(true);
      }
    })
    
    // @ts-ignore
    driverObj.drive();
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
          <div id="reading-instr-modal" className="fixed left-0 top-[25%] z-[70] h-full w-full">
            <div className="m-auto h-[50%] w-[50%]">
              <div className="flex h-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-neutral bg-base-100 p-4">
                <h1 className="text-2xl text-5xl font-bold">
                  Reading Activity
                </h1>

                <p className="text-3xl mt-4 ml-4 mr-4">
                  In this activity, you will be reading document(s) and answering
                  questions based on the content.{" "} Make sure to read the
                  document(s) first before answering the questions.
                </p>

                <p className="text-3xl mt-4 ml-4 mr-4">
                  Here is a tutorial to help you get familiar with the activity.
                </p>

                <button className="btn btn-primary" onClick={runTutorial}>
                  Tutorial
                </button>
                
                <p className="text-3xl mt-4 ml-4 mr-4">
                  Before starting the activity, get comfortable and setup the
                  eye-tracking solution by clicking on {" "}
                  <span>
                    <FontAwesomeIcon icon={faEye} className="fa" />
                  </span> icon. {" "} 
                  Once you are ready and all settled, press
                  Continue.
                </p>

                <button className="btn btn-ghost mt-4 mb-4" onClick={() => {
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

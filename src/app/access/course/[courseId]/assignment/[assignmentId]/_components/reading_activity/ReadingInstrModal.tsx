import { useContext, useEffect, useState} from "react";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEndNavBarContext } from "~/providers/NavbarProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { triggerActionLog } from "~/loggers/ActionsLogger";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const steps = [
  {
    target: "#zoom-controls",
    content: "You can zoom in and out of the text using these buttons.",
    disableBeacon: true,
  },
];

// Create a instruction modal for the PDF Viewer
export default function ReadingInstrModal(props: {
  open: boolean;
  setOpen: (e: boolean) => void;
  onContinue: () => void;
  runningET: boolean;
}) {
  const setEndNavBarContent = useContext(useEndNavBarContext);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [tutorialStart, setTutorialStart] = useState<boolean>(false);

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

  useEffect(() => {
    if (!tutorialStart) return;

    // Generate the steps
    let newSteps: Step[] = [
      {
        target: "#zoom-controls",
        content: "You can zoom in and out of the text using these buttons.",
        disableBeacon: true,
      },
      {
        target: "#task-tray",
        title: "Task Tray",
        placement: "left",
        disableBeacon: true,
        content:
          "Click on the TASK TRAY to access the questions after finish reading the text.",
      },
    ];
    // Get element for the document drawer
    const drawer = document.getElementById("DocumentPane");
    if (drawer) {
      newSteps.push({
        target: "#DocumentPane",
        title: "Document Tray",
        placement: "right",
        content: "Click on the DOC TRAY to access the text.",
        disableBeacon: true,
      });
    }

    newSteps.push({
      target: "#tour-anchor",
      placement: "center",
      title: "Highlighting",
      styles: {options: {width: "50vw"}},
      disableBeacon: true,
      content:
        <div style={{width: '100%'}}><img style={{maxWidth: '100%'}} src='/gifs/highlight.gif' /><p className="py-4">You can highlight text. To remove a highlight, re-highlight the same text.</p></div>,
    });
    newSteps.push({
      target: "#tour-anchor",
      placement: "center",
      title: "Annotate",
      styles: {options: {width: "50vw"}},
      disableBeacon: true,
      content:
        <div style={{width: '100%'}}><img style={{maxWidth: '100%'}} src='/gifs/annotate.gif' /><p className="py-4">You can annotate (make notes) while you read. Make sure to save your notes by pressing the `Save` button.</p></div>,
    });
    newSteps.push({
      target: "#tour-anchor",
      placement: "center",
      title: "Dictionary",
      styles: {options: {width: "50vw"}},
      disableBeacon: true,
      content: <div style={{width: "100%"}}><img style={{maxWidth: '100%'}} src='/gifs/dictionary.gif' /><p className="py-4">To look up words, select a word and press the `LookUp` button. A dictionary entry should popup in the bottom right.</p></div>,
    });
    newSteps.push({
      target: "#eye-tracking-button",
      title: "Eye-Tracking",
      disableBeacon: true,
      content: "To setup up eye-tracking, click here.",
    });
    newSteps.push({
      target: "#instructions-question",
      title: "Instructions & Tutorial",
      disableBeacon: true,
      content:
        "If you ever need to revisit these tutorial/instructions, click here.",
    });

    setSteps(newSteps);
    setRun(true);
    setTutorialStart(false);
  }, [tutorialStart]);

  function openModal() {
    props.setOpen(true);
    triggerActionLog({ type: "instructionOpen", value: {} });
  }

  function runTutorial() {
    props.setOpen(false);
    setTutorialStart(true);
    // setRun(true);
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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      props.setOpen(true);
    }
  };

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        showProgress
        disableCloseOnEsc
        disableScrolling
        steps={steps}
        run={run}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />

      {props.open && (
        <>
          <div
            id="reading-instr-modal"
            className="fixed left-0 top-[15%] z-[70] h-full w-full"
          >
            <div className="m-auto h-[70%] w-[70%]">
              <div className="flex h-full flex-col items-center justify-between overflow-y-auto rounded-2xl border border-neutral bg-base-100 p-4">
                <h1 className="text-2xl text-5xl font-bold">
                  Reading Activity
                </h1>

                <p className="ml-4 mr-4 mt-4 text-2xl">
                  In this activity, you will be reading text and answering
                  questions based on the content. Make sure to read the text
                  first before answering the questions.
                </p>

                <p className="ml-4 mr-4 mt-4 text-2xl">
                  Here is a tutorial to help you get familiar with the activity.
                </p>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={runTutorial}
                >
                  Tutorial
                </button>

                <p className="ml-4 mr-4 mt-4 text-2xl">
                  Before starting the activity, get comfortable and setup the
                  eye-tracking solution by clicking on{" "}
                  <span>
                    <FontAwesomeIcon icon={faEye} className="fa" />
                  </span>{" "}
                  icon. Once you are ready and all settled, press Continue.
                </p>

                <button
                  className="btn btn-secondary btn-lg mb-4 mt-4"
                  onClick={() => {
                    closeModal({ areYouSure: false });
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          <dialog id="are_you_sure_modal" className="modal z-[100]">
            <div className="modal-box">
              <h3 className="text-2xl font-bold">All ready?</h3>
              <p className="py-4 text-xl">
                You haven't setup your eye-tracker. Are you sure you want to
                start the activity?
              </p>
              <div className="modal-action flex w-full flex-row justify-between">
                <form method="dialog">
                  <button
                    className="btn bg-success text-white"
                    onClick={() => {
                      closeModal({ areYouSure: true });
                    }}
                  >
                    Yes
                  </button>
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

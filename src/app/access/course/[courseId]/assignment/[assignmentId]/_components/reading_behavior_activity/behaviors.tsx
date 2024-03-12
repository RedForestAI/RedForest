import { useState, useEffect } from "react";
import { triggerActionLog } from "~/loggers/actions-logger";

type BehaviorProps = {
  behaviorIndex: number;
  setBehaviorIndex: (index: number) => void;
  totalBehaviors: number;
  setComplete: (complete: boolean) => void;
  config?: {
    pageNumber: number;
  };
};

const modalStyle = {
  header: "text-6xl font-bold pb-6",
  paragraph: "text-4xl py-4",
}

export function Linear(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

  function start() {
    if (started) return;
    setStarted(true);
    triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "linear" } });
  }

  function complete() {
    if (!started) {
      alert("You need to start the activity first, by clicking on the first red word.");
      return;
    };
    triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "linear" } });
    if (props.behaviorIndex + 1 === props.totalBehaviors) {
      props.setComplete(true);
    } else {
      props.setBehaviorIndex(props.behaviorIndex + 1);
    }
  }

  useEffect(() => {
    // @ts-ignore
    document.getElementById("linear_instructions").showModal();
  }, []);

  return (
    <>
      <dialog id="linear_instructions" className="modal">
        <div className="modal-box max-w-5xl min-h-[40%]">
          <h3 className={modalStyle.header}>Behavior 1: Regular Reading Pace</h3>
          <div className={modalStyle.paragraph}>
            <p className="underline pb-4" style={{fontWeight: "bold"}}>Read like you NORMALLY do - at your regular speed</p>
            <p className="pb-4">Just read the <span style={{fontWeight: "bold"}}>black </span>text (not <span className="text-gray-500">grey</span>). This teaches the computer how you regularly read.</p>
            <p>
              Got it? Click on the {" "}
              <span className="bg-red-500 text-white">first word</span> {" "}
              to start and the {" "} 
              <span className="bg-red-500 text-white">last word</span>{" "}
              to finish.
            </p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Start</button>
            </form>
          </div>
        </div>
      </dialog>

      <div
        className="absolute left-[14%] top-[34%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
        onClick={start}
      ></div>
      
      <div
        className="absolute left-[22%] top-[58%] h-[2.5%] w-[11%] cursor-pointer bg-red-500 opacity-50"
        onClick={complete}
      ></div>
    </>
  );
}

export function Skimming(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

  function complete() {
    triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "skimming" } });
    if (props.behaviorIndex + 1 === props.totalBehaviors) {
      props.setComplete(true);
    } else {
      props.setBehaviorIndex(props.behaviorIndex + 1);
    }
  }

  useEffect(() => {
    // @ts-ignore
    document.getElementById("skimming_instructions").showModal();
  }, []);

  return (
    <>
      <dialog id="skimming_instructions" className="modal">
        <div className="modal-box max-w-5xl min-h-[40%]">
          <h3 className={modalStyle.header}>Behavior 2: Skimming</h3>
          <div className={modalStyle.paragraph}>
            <p className="underline pb-4" style={{fontWeight: "bold"}}>Read SKIMMING- like you are quickly skimming for important information!</p>
            <p className="pb-4">Just read the <span style={{fontWeight: "bold"}}>black </span>text (not <span className="text-gray-500">grey</span>).</p>
            <p>
              Got it? Click on the {" "}
              <span className="bg-red-500 text-white">first word</span> {" "}
              to start and the {" "} 
              <span className="bg-red-500 text-white">last word</span>{" "}
              to finish.
            </p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Start</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Initial highlight */}
      <div
        className="absolute left-[14%] top-[34%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          setStarted(true);
          triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "skimming" } });
        }}
      ></div>

      <div
        className="absolute left-[50%] top-[87%] h-[2.5%] w-[10%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          if (!started) {
            alert("You need to start the activity. Click on the first red box.");
          } else {
            complete();
          }
        }}
      ></div>
    </>
  );
}

export function Deep(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

  function complete() {
    if (!started) {
      alert("You need to start the activity first, by clicking on the first red word.");
      return;
    }
    triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "deep" } });
    if (props.behaviorIndex + 1 === props.totalBehaviors) {
      props.setComplete(true);
    } else {
      props.setBehaviorIndex(props.behaviorIndex + 1);
    }
  }

  useEffect(() => {
    // @ts-ignore
    document.getElementById("deep_instructions").showModal();
  }, []);

  return (
    <>
      <div
        className="absolute left-[14%] top-[64.25%] h-[0.3%] w-[38%] cursor-pointer bg-black"
      ></div>
      <div
        className="absolute left-[14%] top-[66.75%] h-[0.3%] w-[47%] cursor-pointer bg-black"
      ></div>
      <div
        className="absolute left-[14%] top-[69.25%] h-[0.3%] w-[42%] cursor-pointer bg-black"
      ></div>
      <div
        className="absolute left-[14%] top-[71.5%] h-[0.3%] w-[43%] cursor-pointer bg-black"
      ></div>
      
      <dialog id="deep_instructions" className="modal">
        <div className="modal-box max-w-5xl min-h-[40%]">
          <h3 className={modalStyle.header}>Behavior 3: Slow Reading</h3>
          <div className={modalStyle.paragraph}>
            <p className="underline pb-4" style={{fontWeight: "bold"}}>Read CAREFULLY and SLOWLY– like you are figuring out a hard part of the text that is confusing!</p>
            <p className="pb-4">Just read the <span style={{fontWeight: "bold"}}>black </span>text (not <span className="text-gray-500">grey</span>) </p>
            <p>
              Got it? Click on the {" "}
              <span className="bg-red-500 text-white">first word</span> {" "}
              to start and the {" "} 
              <span className="bg-red-500 text-white">last word</span>{" "}
              to finish.
            </p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Start</button>
            </form>
          </div>
        </div>
      </dialog>

      <div
        className="absolute left-[14%] top-[62%] h-[2.5%] w-[11%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          setStarted(true);
          triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "deep" } });
        }}
      ></div>
      <div
        className="absolute left-[48%] top-[69.5%] h-[2.5%] w-[10%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          complete();
        }}
      ></div>
    </>
  );
}

export function Tracking(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);
  const [finishedReading, setFinishedReading] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  function complete() {
    triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "tracking" } });
    if (props.behaviorIndex + 1 === props.totalBehaviors) {
      props.setComplete(true);
    } else {
      props.setBehaviorIndex(props.behaviorIndex + 1);
    }
  }

  useEffect(() => {
    // @ts-ignore
    document.getElementById("tracking_instructions").showModal();
  }, []);

  return (
    <>
      <>
        {/* Instructions */}
        <dialog id="tracking_instructions" className="modal">
          <div className="modal-box max-w-5xl min-h-[40%]">
            <h3 className={modalStyle.header}>Behavior 4: Tracking</h3>
            <div className={modalStyle.paragraph}>
              <p className="underline pb-4" style={{fontWeight: "bold"}}>Read TRACKING– like you are showing the computer where you are reading. Use the mouse to point to what word you are reading. You can also read it out loud.</p>
              <p className="pb-4">Just read the <span style={{fontWeight: "bold"}}>black </span>text (not <span className="text-gray-500">grey</span>).</p>
              <p>
                Got it? Click on the {" "}
                <span className="bg-red-500 text-white">first word</span> {" "}
                to start and the {" "} 
                <span className="bg-red-500 text-white">last word</span>{" "}
                to finish.
              </p>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-primary">Start</button>
              </form>
            </div>
          </div>
        </dialog>

        <div
          className="absolute left-[14%] top-[72%] h-[2.5%] w-[5%] cursor-pointer bg-red-500 opacity-50"
          onClick={() => {
            setStarted(true);
            triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "tracking" } });
          }}
        ></div>
        
        <div
          className="absolute left-[50%] top-[86.5%] h-[2.5%] w-[11%] cursor-pointer bg-red-500 opacity-50"
          onClick={() => {
            if (!started) {
              alert("You need to start the activity first. Click on the first red word.");
              return;
            }
            complete()
            triggerActionLog({ type: "behaviorEvent", value: { action: "finishedReading", type: "tracking" } });
          }}
        ></div>
      </>
    </>
  );
}

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
  header: "text-3xl font-bold",
  paragraph: "text-lg py-4",
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
        <div className="modal-box">
          <h3 className={modalStyle.header}>Regular Reading Behavior</h3>
          <p className={modalStyle.paragraph}>
            For this behavior, read the first paragraph reading word at your regular pace. Click on the {" "}
            <span className="bg-red-500 text-white">first word</span> when
            you start and the {" "} 
            <span className="bg-red-500 text-white">last word</span>{" "}
            when you finish.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Start</button>
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
  const [finished, setFinished] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

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

  function hide(elementString: string) {
    triggerActionLog({ type: "behaviorEvent", value: { action: "clickedOn", type: "skimming", id: elementString } });
    const element = document.getElementById(elementString);
    if (element) {
      element.style.display = "none";
      setCounter(counter + 1);
      if (counter === 3) {
        setFinished(true);
      }
    }
  }

  return (
    <>
      <dialog id="skimming_instructions" className="modal">
        <div className="modal-box">
          <h3 className={modalStyle.header}>Skimming Reading Behavior</h3>
          <p className={modalStyle.paragraph}>
            In this behavior, you will be skimming a part of the text. To start, click the {" "}
            <span className="bg-red-500 text-white">first word</span>, then {" "}
            read and click the {" "}
            <span className="bg-green-500 text-white">green</span> parts to mark as complete. To finish, click on the {" "}
            <span className="bg-red-500 text-white">last word</span>.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Start</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Initial highlight */}
      <div
        className="absolute left-[14%] top-[34%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          setStarted(true);
          triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "skimming" } });
        }}
      ></div>

      <div
        id="skimming_area_1"
        onClick={() => {
          hide("skimming_area_1")
        }}
      >
        <div
          className="absolute left-[22%] top-[34%] h-[2.5%] w-[37%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
        <div
          className="absolute left-[14%] top-[36.5%] h-[3%] w-[10%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
      </div>

      <div
        id="skimming_area_2"
        onClick={() => {
          hide("skimming_area_2")
        }}
      >
        <div
          className="absolute left-[14%] top-[45.5%] h-[3%] w-[42%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
        <div
          className="absolute left-[14%] top-[48.5%] h-[3%] w-[8%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
      </div>

      <div id="skimming_area_3">
        <div
          className="absolute left-[14%] top-[58%] h-[2.5%] w-[19%] cursor-pointer bg-green-500 opacity-50"
          onClick={() => {
            hide("skimming_area_3")
          }}
        ></div>
      </div>

      <div
        id="skimming_area_4"
        className="absolute left-[48%] top-[69%] h-[3%] w-[10%] cursor-pointer bg-green-500 opacity-50"
        onClick={() => {
          hide("skimming_area_4")
        }}
      ></div>

      <div
        id="skimming_area_5"
        onClick={() => {
          hide("skimming_area_5")
        }}
      >
        <div
          className="absolute left-[14%] top-[81.5%] h-[3%] w-[47%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
        <div
          className="absolute left-[14%] top-[84.5%] h-[3%] w-[11%] cursor-pointer bg-green-500 opacity-50"
        >
        </div>
      </div>

      <div
        className="absolute left-[50%] top-[87%] h-[2.5%] w-[10%] cursor-pointer bg-red-500 opacity-50"
        onClick={() => {
          if (!finished) {
            alert("You need to finish the activity.");
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
        <div className="modal-box">
          <h3 className={modalStyle.header}>Slow Reading Behavior</h3>
          <p className={modalStyle.paragraph}>
            Read the {" "}
            <span className="underline">underlined sentences</span> slowly word-per-word. {" "} 
            Click on the {" "}
            <span className="bg-red-500 text-white">first word</span> when
            you start and the {" "} 
            <span className="bg-red-500 text-white">last word</span> {" "}
            when you finish.{" "}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Start</button>
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

export function ReReading(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);
  const [finishedReading, setFinishedReading] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  function complete() {
    triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "rereading" } });
    if (props.behaviorIndex + 1 === props.totalBehaviors) {
      props.setComplete(true);
    } else {
      props.setBehaviorIndex(props.behaviorIndex + 1);
    }
  }

  useEffect(() => {
    // @ts-ignore
    document.getElementById("rereading_instructions").showModal();
  }, []);

  function hide(elementString: string) {
    triggerActionLog({ type: "behaviorEvent", value: { action: "clickedOn", type: "rereading", id: elementString } });
    const element = document.getElementById(elementString);
    if (element) {
      element.style.display = "none";
      setCounter(counter + 1);
      if (counter === 2) {
        complete();
        triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "rereading" } });
      }
    }
  }

  return (
    <>
      {started ? (
        <>

          {finishedReading
            ? <>
              <div id="rereading_area_1">
                <div
                  className="absolute left-[14%] top-[25%] h-[2.5%] w-[65%] cursor-pointer bg-green-500 opacity-50"
                  onClick={() => {
                    hide("rereading_area_1")
                  }}
                ></div>
                <div
                  className="absolute left-[14%] top-[27.5%] h-[2.5%] w-[13%] cursor-pointer bg-green-500 opacity-50"
                  onClick={() => {
                    hide("rereading_area_1")
                  }}
                ></div>
              </div>

              <div
                id="rereading_area_2"
                className="absolute left-[14%] top-[36%] h-[3%] w-[22%] cursor-pointer bg-green-500 opacity-50"
                onClick={() => {
                  hide("rereading_area_2")
                }}
              ></div>

              <div id="rereading_area_3">
                <div
                  className="absolute left-[21%] top-[48%] h-[2.5%] w-[57%] cursor-pointer bg-green-500 opacity-50"
                  onClick={() => {
                    hide("rereading_area_3")
                  }}
                ></div>
                <div
                  className="absolute left-[14%] top-[50.5%] h-[2.5%] w-[57%] cursor-pointer bg-green-500 opacity-50"
                  onClick={() => {
                    hide("rereading_area_3")
                  }}
                ></div>
              </div>
            </>
            : <>
            <div
              className="absolute left-[57%] top-[59.5%] h-[2.5%] w-[13%] cursor-pointer bg-red-500 opacity-50"
              onClick={() => {
                setFinishedReading(true);
                triggerActionLog({ type: "behaviorEvent", value: { action: "finishedReading", type: "rereading" } });
              }}
            ></div>
            </>
          }
        </>
      ) : (
        <>
          {/* Instructions */}
          <dialog id="rereading_instructions" className="modal">
            <div className="modal-box">
              <h3 className={modalStyle.header}>Re-Reading Behavior</h3>
              <p className={modalStyle.paragraph}>
                Read the last paragraph as you would regularly read. Click at the {" "}
                <span className="bg-red-500 text-white">first word</span> when
                you start and the {" "} 
                <span className="bg-red-500 text-white">last word</span> {" "}
                when you finish.{" "}
                Then re-read the parts of the text in {" "}
                <span className="bg-green-500 text-white">green</span>.
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Start</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Initial highlight */}
          <div
            className="absolute left-[14%] top-[41%] h-[2.5%] w-[11.5%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              setStarted(true);
              triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "rereading" } });
            }}
          ></div>
        </>
      )}
    </>
  );
}

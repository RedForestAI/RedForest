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

export function Linear(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

  function complete() {
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
      {started ? (
        <>
          <div
            className="absolute left-[22%] top-[58%] h-[2.5%] w-[11%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              complete()
            }}
          ></div>
        </>
      ) : (
        <>
          {/* Instructions */}
          <dialog id="linear_instructions" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Regular Reading Behavior</h3>
              <p className="py-4">
                Read the first paragraph reading word per word. Click at the {" "}
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

          {/* Initial highlight */}
          <div
            className="absolute left-[14%] top-[34%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              setStarted(true);
              triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "linear" } });
            }}
          ></div>
        </>
      )}
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
      {started ? (
        <>

          <div
            id="skimming_area_1"
            className="absolute left-[14%] top-[11%] h-[2.5%] w-[46%] cursor-pointer bg-green-500 opacity-50"
            onClick={() => {
              hide("skimming_area_1")
            }}
          ></div>

          <div
            id="skimming_area_2"
            className="absolute left-[14%] top-[36%] h-[3%] w-[22%] cursor-pointer bg-green-500 opacity-50"
            onClick={() => {
              hide("skimming_area_2")
            }}
          ></div>

          <div id="skimming_area_3">
            <div
              className="absolute left-[21%] top-[48%] h-[2.5%] w-[57%] cursor-pointer bg-green-500 opacity-50"
              onClick={() => {
                hide("skimming_area_3")
              }}
            ></div>
            <div
              className="absolute left-[14%] top-[50.5%] h-[2.5%] w-[57%] cursor-pointer bg-green-500 opacity-50"
              onClick={() => {
                hide("skimming_area_3")
              }}
            ></div>
          </div>

          <div
            id="skimming_area_4"
            className="absolute left-[14%] top-[57%] h-[3%] w-[39%] cursor-pointer bg-green-500 opacity-50"
            onClick={() => {
              hide("skimming_area_4")
            }}
          ></div>

          <div
            className="absolute left-[57%] top-[59.5%] h-[2.5%] w-[13%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              if (!finished) {
                alert("You need to finish the activity.");
              } else {
                complete();
              }
            }}
          ></div>
        </>
      ) : (
        <>
          {/* Instructions */}
          <dialog id="skimming_instructions" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Skimming Reading Behavior</h3>
              <p className="py-4">
                Skip throughout the last page of the text and read only the parts that are {" "}
                <span className="bg-green-500 text-white">green</span>. Click at the {" "}
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

          {/* Initial highlight */}
          <div
            className="absolute left-[14%] top-[11%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              setStarted(true);
              triggerActionLog({ type: "behaviorEvent", value: { action: "end", type: "skimming" } });
            }}
          ></div>
        </>
      )}
    </>
  );
}

export function Deep(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

  function complete() {
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
        className="absolute left-[14%] top-[13%] h-[0.3%] w-[41%] cursor-pointer bg-black"
      ></div>
      <div
        className="absolute left-[14%] top-[15.5%] h-[0.3%] w-[42%] cursor-pointer bg-black"
      ></div>
      <div
        className="absolute left-[14%] top-[18%] h-[0.3%] w-[14%] cursor-pointer bg-black"
      ></div>
      {started ? (
        <>
          <div
            className="absolute left-[19.5%] top-[16%] h-[2.5%] w-[8%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              complete();
            }}
          ></div>
        </>
      ) : (
        <>
          {/* Instructions */}
          <dialog id="deep_instructions" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Slow Reading Behavior</h3>
              <p className="py-4">
                Read the {" "}
                <span className="underline">next 2 underlined sentences</span> slowly like {" "} 
                you are trying to figure them out. Click at the {" "}
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

          {/* Initial highlight */}
          <div
            className="absolute left-[14%] top-[11%] h-[2.5%] w-[10%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              setStarted(true);
              triggerActionLog({ type: "behaviorEvent", value: { action: "start", type: "deep" } });
            }}
          ></div>
        </>
      )}
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
              <h3 className="text-lg font-bold">Re-Reading Behavior</h3>
              <p className="py-4">
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

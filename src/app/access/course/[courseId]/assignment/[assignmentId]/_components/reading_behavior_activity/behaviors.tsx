import { useState, useEffect } from "react";

type BehaviorProps = {
  behaviorIndex: number;
  setBehaviorIndex: (index: number) => void;
  config?: {
    pageNumber: number;
  };
};

export function Linear(props: BehaviorProps) {
  if (props.config?.pageNumber != 1) return null;
  const [started, setStarted] = useState<boolean>(false);

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
              props.setBehaviorIndex(props.behaviorIndex + 1);
            }}
          ></div>
        </>
      ) : (
        <>
          {/* Instructions */}
          <dialog id="linear_instructions" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Linear Reading Behavior</h3>
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

  useEffect(() => {
    // @ts-ignore
    document.getElementById("skimming_instructions").showModal();
  }, []);

  return (
    <>
      {started ? (
        <>
          <div
            className="absolute left-[54%] top-[87%] h-[2.5%] w-[6%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              props.setBehaviorIndex(props.behaviorIndex + 1);
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
              Read the next paragraph skimming for important information. Click at the {" "}
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
            className="absolute left-[14%] top-[62%] h-[2.5%] w-[11%] cursor-pointer bg-red-500 opacity-50"
            onClick={() => {
              setStarted(true);
            }}
          ></div>
        </>
      )}
    </>
  );
}

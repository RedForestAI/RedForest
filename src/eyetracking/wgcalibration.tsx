import React, { useEffect, useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GazeDot from "./GazeDot";
import { set } from "zod";

function ClickButton(props: {
  complete: boolean;
  buttonCounter: number;
  setButtonCounter: (buttonCounter: number) => void;
}) {
  const [counter, setCounter] = useState(0);
  const [enabled, setEnabled] = useState(true);

  function handleClick() {
    setCounter(counter + 1);

    if (counter >= 4) {
      setEnabled(false);
      props.setButtonCounter(props.buttonCounter + 1);
    }
  }

  const style: React.CSSProperties = {
    zIndex: 1000,
  };

  return (
    <button
      className="btn btn-circle btn-error"
      style={style}
      disabled={!enabled}
      onClick={handleClick}
    ></button>
  );
}

function EvaluationButton(props: {
  complete: boolean;
  buttonCounter: number;
  setButtonCounter: (buttonCounter: number) => void;
}) {
  const [enabled, setEnabled] = useState(props.complete!);
  const [running, setRunning] = useState(false);
  const [listening, setListening] = useState(false);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      // Handle the event
      let newData = { x: event.detail.x, y: event.detail.y };
      // setGaze(newData)
      console.log(newData);
    };

    // Add event listener
    document.addEventListener("gazeUpdate", handleCustomEvent);
    setListening(true);

    // Cleanup function to remove the event listener
    return () => {
      if (listening) {
        document.removeEventListener("gazeUpdate", handleCustomEvent);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  function handleClick() {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setEnabled(false);
      setFinish(true);
      props.setButtonCounter(props.buttonCounter + 1);
    }, 5000);
  }

  return (
    <>
      {!finish ? (
        <>
          <button
            className={`btn btn-circle ${running ? "btn-warning" : "btn-error"}`}
            style={{
              zIndex: 10000000,
            }}
            disabled={!enabled}
            onClick={handleClick}
          ></button>
        </>
      ) : (
        <>
          <text className="w-1/2 text-center text-3xl">
            The accuracy is %100. 
          </text>
          <text className="w-1/2 text-center">
            If the accuracy is too low, you can recalibrate. Otherwise,
            close the modal with the top-right X.
          </text>
          <button className="btn btn-warning mt-6">Recalibrate</button>
        </>
      )}
    </>
  );
}

export default function WGCalibration(props: {
  calibration: boolean;
  setCalibration: (calibration: boolean) => void;
}) {
  const [complete, setComplete] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [listening, setListening] = useState(false);

  function getMessage() {
    if (complete) {
      if (evaluating) {
        return "Evaluting the calibration. Click on the center red dot and look at it for 5 seconds.";
      } else {
        return "Calibration complete, please close this modal by click on the X on the top right.";
      }
    } else {
      return "Click on each red button 5 times, until each button turns grey.";
    }
  }

  // useEffect(() => {
  //   // @ts-ignore
  //   document?.getElementById("wgcalibration")?.showModal();
  //   props.setCalibration(true);
  //   setComplete(true);
  // }, []);

  useEffect(() => {
    if (buttonCounter == 9) {
      setComplete(true);
    }
  }, [buttonCounter]);

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      // Handle the event
      let newData = { x: event.detail.x, y: event.detail.y };
      setGaze(newData);
    };

    // Add event listener
    if (props.calibration) {
      document.addEventListener("gazeUpdate", handleCustomEvent);
      setListening(true);
    } else {
      document.removeEventListener("gazeUpdate", handleCustomEvent);
      setListening(false);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (listening) {
        document.removeEventListener("gazeUpdate", handleCustomEvent);
      }
    };
  }, [props.calibration]); // Empty dependency array means this effect runs once on mount

  function closeModal() {
    // @ts-ignore
    document?.getElementById("eye-tracker-controller")?.showModal();
    props.setCalibration(false);
  }

  return (
    <dialog id="wgcalibration" className="modal overflow-hidden">
      <div className="modal-box h-[97vh] max-h-full w-[97vw] max-w-full">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-bold">Calibration</h3>
          <form method="dialog">
            <button className={`btn btn-ghost`}>
              <FontAwesomeIcon
                icon={faClose}
                className="fa-2x"
                onClick={closeModal}
              />
            </button>
          </form>
        </div>

        <GazeDot {...gaze} />
        {complete ? (
          <>
            <div className="flex h-full w-full flex-col items-center justify-center">
              <EvaluationButton
                complete={complete}
                buttonCounter={buttonCounter}
                setButtonCounter={setButtonCounter}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[87vh] flex-col justify-between">
              <div className="flex flex-row justify-between">
                {[...Array(3)].map((_, i) => (
                  <ClickButton
                    key={i}
                    complete={complete}
                    buttonCounter={buttonCounter}
                    setButtonCounter={setButtonCounter}
                  />
                ))}
              </div>

              <div className="flex flex-row justify-between">
                {[...Array(3)].map((_, i) => (
                  <ClickButton
                    key={i}
                    complete={complete}
                    buttonCounter={buttonCounter}
                    setButtonCounter={setButtonCounter}
                  />
                ))}
              </div>

              <div className="flex flex-row justify-between">
                {[...Array(3)].map((_, i) => (
                  <ClickButton
                    key={i}
                    complete={complete}
                    buttonCounter={buttonCounter}
                    setButtonCounter={setButtonCounter}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="absolute left-[25vw] top-[30vh] w-[50vw]">
          <p className="text-center text-3xl">{getMessage()}</p>
        </div>
      </div>
    </dialog>
  );
}

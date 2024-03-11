import React, { useEffect, useState, useRef } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GazeDot from "./GazeDot";

const precisionArray: number[] = [];

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
  evaluating: boolean;
  setEvaluating: (evaluating: boolean) => void;
  postEvaluating: boolean;
  setPostEvaluating: (postEvaluating: boolean) => void;
  setButtonCounter: (buttonCounter: number) => void;
}) {
  const [enabled, setEnabled] = useState(props.complete!);
  const [listening, setListening] = useState(false);
  const buttonRef = useRef(null)
  const [averagePrecision, setAveragePrecision] = useState(0);

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      if (!buttonRef.current) return;

      // Handle the event
      let newData = { x: event.detail.x, y: event.detail.y };
      // console.log(newData);

      // Compute the center of the button
      // @ts-ignore
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2;
      const centerY = (rect.top + rect.bottom) / 2;

      // Compute the distance
      const distance = Math.sqrt(Math.pow(event.detail.x - centerX, 2) + Math.pow(event.detail.y - centerY, 2));
      const normalizedDistance = distance / Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
      const precision = 100 - (normalizedDistance * 100);
      precisionArray.push(precision);
    };

    // Clear data
    precisionArray.length = 0;

    // Add event listener
    if (props.evaluating) {
      document.addEventListener("gazeUpdate", handleCustomEvent);
      setListening(true);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (listening) {
        document.removeEventListener("gazeUpdate", handleCustomEvent);
      }
    };
  }, [props.evaluating]); // Empty dependency array means this effect runs once on mount

  function handleClick() {
    props.setEvaluating(true);
    setTimeout(() => {
      props.setEvaluating(false);
      setEnabled(false);
      props.setPostEvaluating(true);
      props.setButtonCounter(props.buttonCounter + 1);

      // Compute average
      console.log(precisionArray)
      let sum = 0;
      for (let i = 0; i < precisionArray.length; i++) {
        // @ts-ignore
        sum += precisionArray[i];
      }
      setAveragePrecision(sum / precisionArray.length);

    }, 5000);
  }

  return (
    <>
      {!props.postEvaluating ? (
        <>
          <button
            ref={buttonRef}
            className={`btn btn-circle ${props.evaluating ? "btn-warning" : "btn-error"}`}
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
            {`The precision is ${averagePrecision.toFixed(0)}.`}
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
  const [complete, setComplete] = useState(true);
  const [buttonCounter, setButtonCounter] = useState(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [listening, setListening] = useState(false);
  
  const [evaluating, setEvaluating] = useState(false);
  const [postEvaluating, setPostEvaluating] = useState(false);

  function getMessage() {
    if (complete) {
      if (!postEvaluating) {
        return "Evaluting the calibration. Click on the center red dot and look at it for 5 seconds.";
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
      setEvaluating(true);
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
                evaluating={evaluating}
                setEvaluating={setEvaluating}
                postEvaluating={postEvaluating}
                setPostEvaluating={setPostEvaluating}
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

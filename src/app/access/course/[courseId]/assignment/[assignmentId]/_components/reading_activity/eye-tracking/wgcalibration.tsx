import React, { useContext, useEffect, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GazeDot from "~/components/webgazer/GazeDot"


function ClickButton(props: {buttonCounter: number, setButtonCounter: (buttonCounter: number) => void}) {
  const [counter, setCounter] = useState(0);
  const [enabled, setEnabled] = useState(true);

  function handleClick() {
    setCounter(counter + 1);

    if (counter >= 4) {
      setEnabled(false);
      props.setButtonCounter(props.buttonCounter + 1)
    }
  }

  return (
    <button 
      className="btn btn-circle btn-error" 
      disabled={!enabled}
      onClick={handleClick}
      >
    </button>
  )
}

export default function WGCalibration() {
  const [complete, setComplete] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);
  const [gaze, setGaze] = useState({x: 0, y: 0});

  function getMessage() {
    if (complete) {
      return "Calibration complete, please close this window."
    } else {
      return ""
    }
  }

  useEffect(() => {
    if (buttonCounter == 9) {
      setComplete(true);
    }
  }, [buttonCounter])

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      // Handle the event
      let newData = {x: event.detail.x, y: event.detail.y}
      setGaze(newData)
    };
  
    // Add event listener
    document.addEventListener("gazeUpdate", handleCustomEvent);
  
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("gazeUpdate", handleCustomEvent);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  function closeModal() {
    // @ts-ignore
    document?.getElementById('eye-tracker-controller')?.showModal()
  }

  return (
    <dialog id="wgcalibration" className="modal overflow-hidden">
      <GazeDot {...gaze}/>
      <div className="modal-box w-[97vw] max-w-full h-[97vh] max-h-full">
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-bold text-lg">Calibration</h3>
          <form method="dialog">
            <button className={`btn btn-ghost ${complete ? "animate-ping" : ""}`}>
              <FontAwesomeIcon icon={faClose} className="fa-2x" onClick={closeModal} />
            </button>
          </form>
        </div>
            {/* Iterating over 9 */}
        <div className="flex flex-col justify-between h-[87vh]">
          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton key={i} buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
            ))}
          </div>

          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton key={i} buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
            ))}
          </div>

          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton key={i} buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
            ))}
          </div>
        </div>

        <div className="absolute top-[30vh] left-[30vw] w-[40vw]">
          <p className="text-center">{getMessage()}</p>
        </div>
        
      </div>
    </dialog>
  )
}
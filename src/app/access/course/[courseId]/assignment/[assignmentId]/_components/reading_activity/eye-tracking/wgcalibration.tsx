import React, { useEffect, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function ClickButton(props: {buttonCounter: number, setButtonCounter: (buttonCounter: number) => void}) {
  const [counter, setCounter] = useState(0);
  const [enabled, setEnabled] = useState(true);

  function handleClick() {
    setCounter(counter + 1);

    if (counter == 5) {
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

export default function WGCalibration(props: {isOpenCalibration: boolean, setIsOpenCalibration: (isOpenCalibration: boolean) => void}) {
  const [complete, setComplete] = useState(false);
  const [buttonCounter, setButtonCounter] = useState(0);

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

  function closeModal() {
    // props.setIsOpenCalibration(false)
    // @ts-ignore
    document?.getElementById('eye-tracker-controller')?.showModal()
  }

  return (
    <dialog id="wgcalibration" className="modal overflow-hidden">
      <div className="modal-box w-[97vw] max-w-full h-[97vh] max-h-full">
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-bold text-lg">Calibration</h3>
          <form method="dialog">
            <button className="btn btn-ghost">
              <FontAwesomeIcon icon={faClose} className="fa-2x" onClick={closeModal} />
            </button>
          </form>
        </div>
            {/* Iterating over 9 */}
        <div className="flex flex-col justify-between h-[87vh]">
          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
            ))}
          </div>

          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
            ))}
          </div>

          <div className="flex flex-row justify-between">
            {[...Array(3)].map((_, i) => (
              <ClickButton buttonCounter={buttonCounter} setButtonCounter={setButtonCounter}/>
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

import React, { useContext, useEffect, useState } from 'react';
import { useEndNavBarContext } from '~/providers/navbar-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClose } from '@fortawesome/free-solid-svg-icons';
import GazeDot from '~/eyetracking/GazeDot';

import WGCalibration from './wgcalibration';
import { AbstractEyeTracker, WebGazeEyeTracker, TobiiProSDKEyeTracker } from './eye-tracker-interface';
import { set } from 'zod';

const triggerEyeTrackerUpdate = (eventName: string, detail: any) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

export default function EyeTrackingController(props: {complete: boolean}) {
  const [open, setOpen] = useState<boolean>(false);
  const [option, setOption] = useState<string>("");
  const [options, setOptions] = useState<{ [id: string]: string[]}>({});
  const [runningET, setRunningET] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<boolean>(false);
  const [eyeTracker, setEyeTracker] = useState<AbstractEyeTracker | null>(null);
  
  // Gaze
  const [listening, setListening] = useState(false);
  const [gaze, setGaze] = useState({x: -100, y: -100});

  // UI
  const [status, setStatus] = useState<React.ReactNode>();
  const [button, setButton] = useState<React.ReactNode>();
  const [calibrationButton, setCalibrationButton] = useState<React.ReactNode>();

  const etProps = {
    setRunningET,
    setCalibration
  }

  const eyeTrackers: { [key: string]: AbstractEyeTracker } = {
    "WebGazer": new WebGazeEyeTracker(etProps),
    "Tobii Pro SDK": new TobiiProSDKEyeTracker(etProps)
  }
  const setEndNavBarContent = useContext(useEndNavBarContext);

  async function openModal() {
    // @ts-ignore
    document?.getElementById('eye-tracker-controller')?.showModal()
    eyeTracker?.show();
    setOpen(true);

    // Get the options for the eye tracker
    await getOptions()
  }

  async function getOptions() {
    // Fetch the eye tracker options, iterate over all eyetrackers
    let options: { [id: string]: string[] } = {};
    for (let key in eyeTrackers) {
      let etOptions = await eyeTrackers[key]!.getOption(); 
      options[key] = etOptions;
    }
    setOptions(options);
  }

  function updateOption(e: any) {
    setOption(e.target.value);

    // Split the value by the special character to get the key and the option value
    const value = e.target.value;
    const [key, optionValue] = value.split('|');

    // Set the eye tracker
    let et = eyeTrackers[key];
    et!.config(optionValue);
    setEyeTracker(et!)
  }

  function closeModal() {
    eyeTracker?.hide()
    setOpen(false);
  }

  useEffect(() => {
    const endNavBarExtras = (
      <div className="pr-2">
        <button className="btn btn-ghost" onClick={openModal}>
          <FontAwesomeIcon icon={faEye} className="fa-2x" />
        </button>
      </div>
    )

    getOptions();
    setEndNavBarContent(endNavBarExtras);

    return () => setEndNavBarContent(null);
  }, []);

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      // Handle the event
      let newData = {x: event.detail.x, y: event.detail.y}
      setGaze(newData)
    };
  
    // Add event listener
    if (!listening) {
      if (open) {
        document.addEventListener("gazeUpdate", handleCustomEvent);
        setListening(true);
        console.log("Added listener")
      }
      else {
        document.removeEventListener("gazeUpdate", handleCustomEvent);
        setListening(false);
      }
    }
  
    // Cleanup function to remove the event listener
    return () => {
      if (listening) {
        document.removeEventListener("gazeUpdate", handleCustomEvent);
      }
    };
  }, [open]);

  useEffect(() => {
    if (props.complete) {
      if (runningET) {
        eyeTracker?.end();
        triggerEyeTrackerUpdate("eyeTracker", {type: "eyeTracker", value: {action: "end", type: option}});
      }
    }
  }, [props.complete])

  useEffect(() => {
    if (runningET) {
      if (calibration) {
        triggerEyeTrackerUpdate("eyeTracker", {type: "eyeTracker", value: {action: "calibrate-start", type: option}});
      } else {
        triggerEyeTrackerUpdate("eyeTracker", {type: "eyeTracker", value: {action: "calibrate-end", type: option}});
      }
    }
  }, [calibration])

  useEffect(() => {
    let value = "stop"
    if (runningET) {
      value = "start"
    }
    triggerEyeTrackerUpdate("eyeTracker", {type: "eyeTracker", value: {action: value, type: option}});

    // Reset the gaze point value
    setGaze({x: -100, y: -100});
  }, [runningET])

  useEffect(() => {
    if (eyeTracker) {
      setStatus(eyeTracker.getStatus(runningET));
      setButton(eyeTracker.getButton(runningET));
      setCalibrationButton(eyeTracker.getCalibrationButton(runningET));
    }
  }, [eyeTracker, runningET])

  return (
    <>
      <WGCalibration calibration={calibration} setCalibration={setCalibration}/>
      <dialog id="eye-tracker-controller" className="modal">
        {open &&
          <GazeDot {...gaze}/>
        }
        
        <div className="modal-box">
          <div className="flex flex-row justify-between items-center">
            Eye-Tracking Controller
            <form method="dialog">
              <button className="btn btn-ghost">
                <FontAwesomeIcon icon={faClose} className="fa-2x" onClick={closeModal}/>
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="text-xl">Eye-Tracker</div>
            <select value={option} onChange={updateOption} disabled={runningET} className="select select-bordered w-full">
              <option value="" disabled>Select an Eye-Tracker</option>

              {/* Iterate over the keys and then iterate of their string[] */}
              {Object.keys(options).map((key, index) => (
                <>
                  {options[key]!.map((option, index) => (
                    <option key={index} value={`${key}|${option}`}>{option}</option>
                  ))}
                </>
              ))}

            </select>

            {eyeTracker &&
              <>
              <div className="text-xl mt-4">Status</div>
                <div className="flex flex justify-between items-center">
                  <div className="flex flex-row">
                    <p>State:</p>
                    {status}
                  </div>
                    {button}
                </div>
                {calibrationButton}
              </> 
            }

          </div>
        </div>
      </dialog>
    </>
  )
}
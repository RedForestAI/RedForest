
import React, { useContext, useEffect, useState } from 'react';
import { useEndNavBarContext } from '~/providers/navbar-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClose } from '@fortawesome/free-solid-svg-icons';

import WGCalibration from './wgcalibration';
import { AbstractEyeTracker, WebGazeEyeTracker, TobiiProSDKEyeTracker } from './eye-tracker-interface';

const triggerEyeTrackerUpdate = (eventName: string, detail: any) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

export default function EyeTrackingController(props: {complete: boolean}) {
  const [option, setOption] = useState<string>("WebGazer");
  const [options, setOptions] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [runningET, setRunningET] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<boolean>(false);
  const [eyeTracker, setEyeTracker] = useState<AbstractEyeTracker | null>(null);

  const etProps = {
    connected,
    runningET,
    setConnected,
    setRunningET
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

    await getOptions()
  }

  async function getOptions() {
    // Fetch the eye tracker options, iterate over all eyetrackers
    let options: string[] = [];
    for (let key in eyeTrackers) {
      let etOptions = await eyeTrackers[key]!.getOption(); 
      options = [...options, ...etOptions]
    }
    setOptions(options);
  }

  function updateOption(e: any) {
    setOption(e.target.value);
  }

  function closeModal() {
    eyeTracker?.hide()
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
  }, [runningET])

  function getStatus() {
    return eyeTracker?.getStatus();
  }

  function getButton() {
    return eyeTracker?.getButton();
  }

  function calibrate() {
    eyeTracker?.calibrate();
  }

  return (
    <>
      <WGCalibration calibration={calibration} setCalibration={setCalibration}/>
      <dialog id="eye-tracker-controller" className="modal">
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
              {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>

            <div className="text-xl mt-4">Status</div>
            <div className="flex flex justify-between items-center">
              <div className="flex flex-row">
                <p>State:</p>
                {getStatus()}
              </div>
                {getButton()}
            </div>

            {/* <button className="btn btn-primary" disabled={!runningET} onClick={calibrate}>Calibrate</button> */}
            <button className="btn btn-primary" onClick={calibrate}>Calibrate</button>

          </div>
        </div>
      </dialog>
    </>
  )
}
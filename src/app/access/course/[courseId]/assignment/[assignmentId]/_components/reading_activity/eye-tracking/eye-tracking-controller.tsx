
import React, { useContext, useEffect, useState } from 'react';
import { useEndNavBarContext } from '~/providers/navbar-provider';
// import { webGazerContext } from '~/providers/WebGazerContext';
import { WebGazerManager } from "~/providers/WebGazerManager"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClose } from '@fortawesome/free-solid-svg-icons';

import WGCalibration from './wgcalibration';

export default function EyeTrackingController() {
  const [option, setOption] = useState<string>("WebGazer");
  const [connected, setConnected] = useState<boolean>(false);
  const [runningET, setRunningET] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<boolean>(false);

  const setEndNavBarContent = useContext(useEndNavBarContext);
  const webGazer = new WebGazerManager();

  const wgHandleStart = () => {
    webGazer.start();
    setRunningET(true);
  };

  const wgHandleStop = () => {
    webGazer.restart()
    setRunningET(false);
  };

  function openModal() {
    // @ts-ignore
    document?.getElementById('eye-tracker-controller')?.showModal()
    webGazer.show();
  }

  function updateOption(e: any) {
    setOption(e.target.value);
  }

  function closeModal() {
    webGazer.hide()
  }

  useEffect(() => {
    const endNavBarExtras = (
      <div className="pr-2">
        <button className="btn btn-ghost" onClick={openModal}>
          <FontAwesomeIcon icon={faEye} className="fa-2x" />
        </button>
      </div>
    )

    setEndNavBarContent(endNavBarExtras);

    return () => setEndNavBarContent(null);
  }, []);

  function getWebGazerStatus() {
    if (runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    return (
      <p className="ml-2">Ready</p>
    )
  }

  function getSparkStatus() {
    if (runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    if (connected) {
      return (
        <p className="ml-2">Connected</p>
      )
    }
    return (
      <p className="ml-2 text-error">Not Found</p>
    )
  }

  function getStatus() {

    switch (option) {
      case "WebGazer":
        return getWebGazerStatus();
      case "Spark":
        return getSparkStatus();
    }
  }

  function getWebGazerButton() {
    if (runningET) {
      return (
        <button className="btn btn-error w-5/12" onClick={wgHandleStop}>Stop</button>
      )
    }
    return (
      <button className="btn btn-primary w-5/12" onClick={wgHandleStart}>Start</button>
    )
  }

  function getSparkButton() {
    if (runningET) {
      return (
        <button className="btn btn-error w-5/12">Stop</button>
      )
    }
    if (connected) {
      return (
        <button className="btn btn-primary w-5/12">Start</button>
      )
    }
    return (
      <button className="btn btn-secondary w-5/12">Connect</button>
    )
  }

  function getButton() {
    switch (option) {
      case "WebGazer":
        return getWebGazerButton();
      case "Spark":
        return getSparkButton();
    }
  }

  function calibrate() {
    switch (option) {
      case "WebGazer":
        // @ts-ignore
        document?.getElementById('wgcalibration')?.showModal()
        setCalibration(true);
        break;
      case "Spark":
        return () => {};
    }
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
              <option value="WebGazer">WebGazer</option>
              <option value="Spark">Tobii Pro Spark</option>
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
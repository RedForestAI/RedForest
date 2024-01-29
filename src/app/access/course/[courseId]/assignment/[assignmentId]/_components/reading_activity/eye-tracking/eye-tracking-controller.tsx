
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useEndNavBarContext } from '~/providers/navbar-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react'
import { faEye, faClose } from '@fortawesome/free-solid-svg-icons';

import WGCalibration from './wgcalibration';
import { WebGazerManager } from '~/providers/WebGazerManager';

export default function EyeTrackingController() {
  const [option, setOption] = useState<string>("WebGazer");
  const [connected, setConnected] = useState<boolean>(false);
  const [runningET, setRunningET] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [isOpenCalibration, setIsOpenCalibration] = useState<boolean>(true)

  const { setEndNavBarContent } = useContext(useEndNavBarContext);
  let webGazer = new WebGazerManager();

  const wgHandleStart = () => {
    webGazer.start();
    setRunningET(true);
  };
  
  const wgHandleHide = () => {
    webGazer.hide();
  };
  
  const wgHandleShow = () => {
    webGazer.show();
  };

  const wgHandleStop = () => {
    webGazer.stop();
    webGazer.end();
    webGazer = new WebGazerManager();
    setRunningET(false);
  };

  function closeModal() {
    setIsOpen(false)
    if (runningET) {
      wgHandleHide();
    }
  }

  function openModal() {
    setIsOpen(true)
    console.log("showing")
    switch (option) {
      case "WebGazer":
        wgHandleShow();
        break;
      case "Spark":
        break;
    }
  }

  function updateOption(e: any) {
    setOption(e.target.value);
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

      case "Spark":
        return () => {};
    }
  }

  return (
    <>
      <WGCalibration isOpenCalibration={isOpenCalibration} setIsOpenCalibration={setIsOpenCalibration}/>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform bg-base-100 rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 border-b-4 border-inherit pb-2"
                  >
                    <div className="flex flex-row justify-between items-center">
                      Eye-Tracking Controller
                      <button className="btn btn-ghost">
                        <FontAwesomeIcon icon={faClose} className="fa-2x" onClick={closeModal} />
                      </button>
                    </div>
                  </Dialog.Title>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="text-xl">Eye-Tracker</div>
                    <select value={option} onChange={updateOption} disabled={runningET} className="select select-bordered w-full">
                      <option disabled selected>Eye-Tracker</option>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
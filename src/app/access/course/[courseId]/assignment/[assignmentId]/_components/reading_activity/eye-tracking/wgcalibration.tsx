import React, { Fragment, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WGCalibration(props: {isOpenCalibration: boolean, setIsOpen: any, setIsOpenCalibration: (isOpenCalibration: boolean) => void}) {

  function closeModal() {
    props.setIsOpenCalibration(false)
    props.setIsOpen(true)
  }

  return (
    <dialog id="calibration" className={`modal ${props.isOpenCalibration ? "modal-open" : ""}`}>
      <div className="modal-box w-[97vw] max-w-full h-[97vh] max-h-full">
        <div className="flex flex-row justify-between items-center">
          <h3 className="font-bold text-lg">Hello!</h3>
          <button className="btn btn-ghost">
              <FontAwesomeIcon icon={faClose} className="fa-2x" onClick={closeModal} />
            </button>
        </div>
      </div>
    </dialog>
  )
}
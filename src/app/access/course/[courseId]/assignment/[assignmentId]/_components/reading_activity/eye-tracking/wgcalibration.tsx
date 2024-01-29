import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react';


export default function WGCalibration(props: {isOpenCalibration: boolean, setIsOpenCalibration: (isOpenCalibration: boolean) => void}) {

  function closeModal() {
    props.setIsOpenCalibration(false)
  }

  function openModal() {
    props.setIsOpenCalibration(true)
  }

  return (
    <dialog id="my_modal_1" className={`modal ${props.isOpenCalibration ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn" onClick={closeModal}>Close</button>
        </div>
      </div>
    </dialog>
  )
}
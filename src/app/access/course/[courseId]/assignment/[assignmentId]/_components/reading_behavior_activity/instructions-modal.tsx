import React, { useEffect } from 'react';

type InstructionsModalProps = {
  setInInstructions: (inInstructions: boolean) => void;
}

export default function InstructionsModal(props: InstructionsModalProps) {

  useEffect(() => {
    // @ts-ignore
    document.getElementById('general_instructions_modal').showModal()
  }, [])

  return (
    <dialog id="general_instructions_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={() => {props.setInInstructions(false)}}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
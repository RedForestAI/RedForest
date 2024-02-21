// Create a blur modal for the PDF Viewer
export default function BlurModal(props: { onContinue: () => void }) {
  return (
    <div className="fixed top-[30%] left-0 w-full h-full z-40">
      <div className="w-[50%] h-[35%] m-auto">
        <div className="flex flex-col h-full items-center bg-base-100 border border-neutral rounded-2xl overflow-hidden p-4">
        <h1 className="text-2xl font-bold pb-12 text-5xl">Getting Ready!</h1>
          <h1 className="h-5/6 text-3xl">Before starting the activity, get comfortable and setup the eye-tracking solution. Once you are ready and all settled, press Continue.</h1>
          <button className="btn btn-primary" onClick={props.onContinue}>Continue</button>
        </div>
      </div>
    </div>
  )
}
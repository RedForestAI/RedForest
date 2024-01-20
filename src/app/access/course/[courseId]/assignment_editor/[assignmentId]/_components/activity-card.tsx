import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export function ActivityCard(props: {icon: IconDefinition}) {
  return (
    <div className="card w-full bg-base-200 border shadow-xl m-4">
        <div className="flex flex-row h-full">
          <div className="flex justify-center items-center border-r p-6">
            <FontAwesomeIcon icon={props.icon} className="h-16"/>
          </div>
          <div className="flex flex-col w-9/12 p-4">
            <h2 className="card-title">Activity</h2>
            <p className="card-subtitle">Subtitle</p>
          </div>
          <h2 className="card-title">5 pts</h2>
        </div>
    </div>
  )
}

export function EmptyActivityCard() {
  return (
    <div className="card w-full bg-base-200 border shadow-xl m-4">
      <div className="justify-center items-center flex flex-col h-28">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}
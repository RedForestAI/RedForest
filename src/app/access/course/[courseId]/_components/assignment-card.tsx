import { Assignment, Course } from '@prisma/client'
import Link from "next/link";

interface AssignmentCardProps {
  course: Course
  assignment: Assignment
}

const AssignmentCard = ( props : AssignmentCardProps) => {
  
  const getDate = () => {
    const date = new Date(props.assignment.dueDate);
    return date.toLocaleDateString();
  }

  const getColor = () => {
    const date = new Date(props.assignment.dueDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) {
      return "text-red-600";
    } else if (days < 1) {
      return "text-yellow-600";
    } else {
      return "text-lime-600";
    }
  }

  return (
    <span className="items-center self-stretch bg-neutral-800 flex flex-col px-2 py-3 rounded-2xl mt-4">
      <span className="self-stretch flex justify-between gap-5 items-start max-md:max-w-full max-md:flex-wrap">
        <span className="flex flex-col items-stretch">
          <div className="justify-center text-white text-xl">
            {props.assignment.name}
          </div>
          <div className="justify-center text-white text-base whitespace-nowrap mt-1.5">
            {props.course.name}
          </div>
        </span>
        <div className="justify-center text-base mt-5 self-end">
          Due: <span className={getColor()}>{getDate()}</span>
        </div>
      </span>
      <div className="bg-neutral-700 self-stretch flex flex-col justify-center items-stretch pr-5 rounded-2xl max-md:max-w-full max-md:pr-5 mt-5">
        <div className="bg-lime-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: "45%"}}> 45%</div>
      </div>
    </span>
  )
};

export default AssignmentCard;
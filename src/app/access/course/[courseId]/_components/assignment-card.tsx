import { Assignment, Course, AssignmentData } from '@prisma/client'
import Link from "next/link";

interface AssignmentCardProps {
  course: Course
  assignment: Assignment
  assignmentData?: AssignmentData
  editable: boolean
}

const AssignmentCard = ( props : AssignmentCardProps) => {
  
  const getAssignmentTitle = () => {
    if (!props.assignment.published) {
      return `[Draft] ${props.assignment.name}`
    }
    return props.assignment.name;
  }

  const getDate = () => {
    const date = new Date(props.assignment.dueDate);
    return date.toLocaleDateString();
  }

  const getColor = () => {
    // Teacher
    if (!props.assignment.published) return "text-base-content";

    // Student
    // If completed, return green
    if (props.assignmentData?.completed) return "text-success";

    const date = new Date(props.assignment.dueDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) {
      return "text-error";
    } else if (days < 1) {
      return "text-warning";
    } else {
      return "text-success";
    }
  }

  const getLink = () => {

    // Teacher
    if (props.editable) {
      if (!props.assignment.published) return `/access/course/${props.course.id}/assignment_editor/${props.assignment.id}`;
      return `/access/course/${props.course.id}/assignment_report/${props.assignment.id}`;
    }

    // Student
    if (props.assignmentData?.completed) return `/access/course/${props.course.id}/assignment_report/${props.assignment.id}`
    return `/access/course/${props.course.id}/assignment/${props.assignment.id}`

  }

  return (
    <Link href={getLink()}>
      <div className="items-center self-stretch bg-base-100 shadow-xl border-[3px] border-solid flex flex-col px-2 py-3 rounded-2xl mt-4 pl-4 pr-4">
        <span className="self-stretch flex justify-between gap-5 items-start max-md:max-w-full max-md:flex-wrap">
          <span className="flex flex-col items-stretch">
            <div className="justify-center text-xl">
              {getAssignmentTitle()}
            </div>
            <div className="justify-center whitespace-nowrap mt-1.5">
              {props.course.name}
            </div>
          </span>
          <div className="flex flex-col justify-end items-end gap-2 self-end w-36">
            {props.assignmentData && props.assignmentData.completed && <div className="badge badge-success">Completed</div>}
            <span className={getColor()}>{`${getDate()}`}</span>
          </div>
        </span>
        {!props.assignmentData?.completed &&
          <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch pr-5 rounded-2xl max-md:max-w-full max-md:pr-5 mt-5">
            <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: "0%"}}> 0%</div>
          </div>
        }
      </div>
    </Link>
  )
};

export default AssignmentCard;
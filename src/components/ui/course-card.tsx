import { Course } from '@prisma/client'
import DropDown from './course-dropdown-menu';

interface CourseCardProps {
  course: Course
  enableOptions: boolean
}

const CourseCard = ( props : CourseCardProps) => {
  return (
    <div className="bg-neutral-800 flex w-full flex-col items-stretch mt-3 pb-5 rounded-2xl">
      <div className="bg-emerald-300 flex shrink-0 h-[104px] flex-col rounded-t-2xl" />
      <div className="flex items-stretch justify-between gap-5 mt-3 pr-5">
        <span className="flex flex-col items-stretch px-2">
          <div className="justify-center text-white text-xl">{props.course.name}</div>
          <div className="justify-center text-white text-opacity-50 text-base">
            Fall 2023
          </div>
        </span>
        {props.enableOptions && <DropDown courseId={props.course.id} teacherId={props.course.teacherId}/>}
      </div>
    </div>
  )
};

export default CourseCard;
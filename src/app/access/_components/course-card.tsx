import { Course } from '@prisma/client'
import Link from "next/link";
import CourseOptions from './course-options';

interface CourseCardProps {
  course: Course
  enableOptions: boolean
}

const CourseCard = ( props : CourseCardProps) => {
  return (
    <div className="bg-base mt-4 rounded-2xl border border-neutral overflow-hidden">
      <Link href={`access/course/${props.course.id}`}>
        <div className="bg-primary flex shrink-0 h-[104px] flex-col" />
      </Link>
      <div className="flex w-full flex-col items-stretch pb-5 rounded-b-2xl">
        <div className="flex items-stretch justify-between gap-5 mt-3 pr-5">
          <span className="flex flex-col items-stretch px-2 ml-4">
            <div className="justify-center text-xl">{props.course.name}</div>
            <div className="justify-center text-opacity-50">
              Fall 2023
            </div>
          </span>
        {props.enableOptions && <CourseOptions course={props.course} teacherId={props.course.teacherId}/>}
        </div>
      </div>
    </div>
  )
};

export default CourseCard;

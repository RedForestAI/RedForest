"use client";

import { Course } from '@prisma/client'
import CourseOptions from './CourseOptions';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

interface CourseCardProps {
  course: Course
  enableOptions: boolean
}

const CourseCard = ( props : CourseCardProps) => {
  const router = useRouter();

  function openModal(event: any) {
    event.preventDefault()
    event.stopPropagation()
    event.cancelBubble = true
    // @ts-ignore
    document.getElementById(`course_options_modal_${props.course.id}`).showModal()
  }

  const directToCourse = () => {
    router.push(`access/course/${props.course.id}`)
  }

  return (
    <>
      <div className="bg-base mt-4 rounded-2xl border border-neutral overflow-hidden cursor-pointer" onClick={directToCourse}>
        <div className="bg-primary flex shrink-0 h-[104px] flex-col"/>
        <div className="flex w-full flex-col items-stretch pb-5 rounded-b-2xl">
          <div className="flex items-stretch justify-between gap-5 mt-3 pr-5">
            <span className="flex flex-col items-stretch px-2 ml-4">
              <div className="justify-center text-xl">{props.course.name}</div>
              <div className="justify-center text-opacity-50">
                Fall 2023
              </div>
            </span>
            {props.enableOptions && 
            <>
              <div className="flex justify-center items-center" onClick={openModal}>
                <FontAwesomeIcon icon={faGear} className='h-8 fa-2x'/>
              </div>
            </>
            }
          </div>
        </div>
      </div>
      {props.enableOptions &&
        <CourseOptions course={props.course} teacherId={props.course.teacherId}/>
      }
    </>
  )
};

export default CourseCard;

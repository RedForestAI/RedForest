'use client';

import { Course } from '@prisma/client'

interface CourseCardProps {
  course: Course
}

const CourseCard = ( props : CourseCardProps) => {
  return (
    <div>{props.course.name}</div>
  )
};

export default CourseCard;
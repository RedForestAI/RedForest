import { Profile, Role } from '@prisma/client'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { db } from '~/server/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseUrl = new URL(request.url).origin;
  // const token_hash = searchParams.get('token_hash')
  // const type = searchParams.get('type') as EmailOtpType | null
  // const next = searchParams.get('next') ?? `${baseUrl}`
  const courseId = searchParams.get('courseId') as string | null
  const password = searchParams.get('password') as string | null

  if (!courseId || !password) {
    return NextResponse.redirect(`${baseUrl}`)
  }

  console.log(courseId, password)
  console.log(request.headers)

  // Get Supabase Auth user
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const user = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${baseUrl}`)
  }

  // Get profile
  let profile: Profile | null = null;
  try {
    profile = await db.profile.findUniqueOrThrow({
      where: { id: user.data.user?.id},
    })
    console.log(profile)
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(`${baseUrl}`)
  }

  // Ensure that the user is a student
  if (profile?.role !== Role.STUDENT) {
    return NextResponse.redirect(`${baseUrl}`)
  }

  // Ensure that the password is correct
  try {
    const course = await db.course.findUniqueOrThrow({
      where: { id: courseId },
    })
    const coursePassword = await db.coursePassword.findUniqueOrThrow({
      where: { id: course.passwordId },
    })
    if (coursePassword.secret !== password) {
      return NextResponse.redirect(`${baseUrl}`)
    }
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(`${baseUrl}`)
  }

  // Check that the student is not already enrolled
  try {
    const courseEnrollments = await db.courseEnrollment.findMany({
      where: { studentId: profile.id },
    })
    const courseEnrollment = courseEnrollments.find((courseEnrollment) => courseEnrollment.courseId === courseId)
    if (courseEnrollment) {
      return NextResponse.redirect(`${baseUrl}`)
    }
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(`${baseUrl}`)
  }

  // If all checks out, enroll the student
  try {
    await db.courseEnrollment.create({
      data: {
        courseId: courseId,
        studentId: profile.id,
      }
    })
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(`${baseUrl}`)
  }

  // Assuming you want to redirect to the root of your site
  return NextResponse.redirect(`${baseUrl}/access`);
}

// http://localhost:3000/api/enroll?courseId=52fe7355-242a-47b9-9292-7eda477c13fe&password=q4h67176
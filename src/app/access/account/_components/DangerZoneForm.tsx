"use client";

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type DangerZoneFormProps = {
  profile: Profile
}

export default function DangerZoneForm(props: DangerZoneFormProps) {
  const accountConvert = api.auth.convertToTeacher.useMutation()
  const accountDelete = api.auth.deleteAccount.useMutation()
  const router = useRouter();

  const convertToTeacher = async () => {
    try {
      await accountConvert.mutateAsync({profileId: props.profile.id})
      console.log("Converted to teacher")
      router.refresh();
    } catch (error: any) {
      console.log("Failed to convert to teacher: " + error?.message)
    }
  }

  const deleteAccount = async () => {
    try {
      await accountDelete.mutateAsync({profileId: props.profile.id})
      console.log("Deleted account")
      router.push("/api/auth/logout");
    } catch (error: any) {
      console.log("Failed to delete account: " + error?.message)
    }
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-error rounded-md">DangerZone</h1>
      <div className="border-2 rounded-xl border-error p-4">
        {props.profile.role == "STUDENT" &&
          <div>
            <p className="mb-4">Convert your account from STUDENT to TEACHER. This will delete all course enrollments and user information.</p>
            <button onClick={convertToTeacher} className="bg-error text-white hover:bg-error font-bold py-2 px-4 rounded"> Convert to TEACHER </button>
          </div>
        }
        <p className="mt-4 mb-4">Beware that deleting your account is permanent and will delete all your courses and user information.</p>
        <button onClick={deleteAccount} className="bg-error hover:bg-error text-white font-bold py-2 px-4 rounded"> Delete Account </button>
      </div>
    </>
  )
}
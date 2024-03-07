import { useEffect, useContext } from "react";
import { InAssignmentContext } from "~/providers/InAssignmentProvider";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UploadingSession() {
  const {uploadingSession, afterUploadHref, setInAssignment, setUploadingSession, setAfterUploadHref} = useContext(InAssignmentContext)
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {

    async function LogoutButton() {
      await supabase.auth.signOut();
      fetch(`${origin}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => console.log(response))
    }

    if (uploadingSession) {
      // @ts-ignore
      document.getElementById("uploading_session").showModal();
    }
    else {
      // Redirect to the originally requested URL
      if (afterUploadHref) {
        // Clear data
        setInAssignment(false);
        setUploadingSession(false);
        setAfterUploadHref("");
        if (afterUploadHref === 'logout') {
          LogoutButton();
          router.push('../session/login')
          router.refresh();
          return
        }
        router.push(afterUploadHref);
      }
    }
  }, [uploadingSession])

  return (
    <>
      <dialog id="uploading_session" className="modal z-[100]">
        <div className="modal-box">
          <h3 className="font-bold text-4xl">Saving Session</h3>
          <div className="flex flex-col items-center justify-center">
            <span className="h-[4/6] w-4/6 loading loading-spinner loading-lg"></span>
            <h1 className="text-2xl">Uploading your session files, hold on tight...</h1>
          </div>
        </div>
      </dialog>
    </>
  )
}
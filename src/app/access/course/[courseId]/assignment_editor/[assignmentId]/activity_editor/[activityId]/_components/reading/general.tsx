import { Activity } from "@prisma/client";

type GeneralProps = {
  activity: Activity
  formRegister: any
  errors: any
}

export default function General(props: GeneralProps) {
  return (
    <div role="tabpanel" className="tab-content p-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label> 
        <input type="text" {...props.formRegister("name", { required: true, maxLength: 30})} className="input input-bordered"/>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description (optional)</span>
        </label> 
        <textarea placeholder="Reading Description" className="textarea textarea-bordered h-24"></textarea>
      </div>
    </div>
  )
}
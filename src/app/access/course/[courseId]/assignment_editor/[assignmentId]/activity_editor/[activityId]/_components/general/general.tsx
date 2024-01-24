import { Activity } from "@prisma/client";

type GeneralProps = {
  activity: Activity
  setActivity: any
  // formRegister: any
  // errors: any
}

export default function General(props: GeneralProps) {

  const setName = (e: any) => {
    props.setActivity({...props.activity, name: e.target.value});
  }
  const setDescription = (e: any) => {
    props.setActivity({...props.activity, description: e.target.value});
  }

  return (
    <div role="tabpanel" className="tab-content p-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label> 
        <input type="text" value={props.activity.name} onChange={setName} className="input input-bordered"/>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description (optional)</span>
        </label> 
        <textarea value={props.activity.description!} onChange={setDescription} placeholder="Reading Description" className="textarea textarea-bordered h-24"></textarea>
      </div>
    </div>
  )
}
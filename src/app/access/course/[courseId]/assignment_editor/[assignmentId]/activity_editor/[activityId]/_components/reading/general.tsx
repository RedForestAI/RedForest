export default function General() {
  return (
    <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box shadow-xl p-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label> 
        <input type="text" placeholder="Reading Name" className="input input-bordered"/>
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
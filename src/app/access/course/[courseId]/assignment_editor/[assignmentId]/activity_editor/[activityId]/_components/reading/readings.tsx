// https://innocentanyaele.medium.com/create-a-drag-and-drop-file-component-in-reactjs-nextjs-tailwind-6ae70ba06e4b
import { useRef, useState, useEffect } from "react";
import { Reorder } from 'framer-motion';
import { FileCard, formatBytes } from "./file-card"

const sizeLimit = 5000000; // 5MB

export default function Readings() {

  const [error, setError] = useState< string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [totalMemory, setTotalMemory] = useState<number>(() => {
    let total = 0;
    files.forEach(file => {
      total += file.size;
    })
    return total;
  });

  useEffect(() => {
    computeTotalMemory();
  }, [files])

  function computeTotalMemory() {
    let total = 0;
    files.forEach(file => {
      total += file.size;
    })
    setTotalMemory(total);
  }

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    let total = totalMemory;
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files["length"]; i++) {
        
        // check if file is pdf
        if (e.target.files[i].type !== "application/pdf" || (totalMemory + e.target.files[i].size) > sizeLimit) {
          setError("Only PDFs are supported");
        }
        else if ((total + e.traget.files[i].size) > sizeLimit){
          setError("Total memory limit exceeded of 5MB");
        }
        else {
          setFiles((prevState: any) => [...prevState, e.target.files[i]]);
          total += e.target.files[i].size;
        }
      }
    }
  }

  function handleSubmitFile(e: any) {
    if (files.length === 0) {
      // no file has been submitted
    } else {
      // write submit logic here
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("File has been added");
    console.log(e.dataTransfer.files)
    let total = totalMemory;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {

        // check if file is pdf
        if (e.dataTransfer.files[i].type !== "application/pdf") {
          setError("Only PDFs are supported");
        }
        else if ((total + e.dataTransfer.files[i].size) > sizeLimit){
          setError("Total memory limit exceeded of 5MB");
        }
        else {
          setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
          total += e.dataTransfer.files[i].size;
        }
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div role="tabpanel" className="tab-content rounded-box shadow-xl p-6">
      <div className="flex flex-col">
        <form
          className={`${
            dragActive ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"
          } w-full p-4 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            multiple={true}
            onChange={handleChange}
            accept=".pdf"
          />

          <p>
            Drag & Drop files or{" "}
            <span
              className="font-bold text-secondary cursor-pointer"
              onClick={openFileExplorer}
            >
              <u>Select files</u>
            </span>{" "}
            to upload
          </p>
          <p className="text-xs">Only PDFs files are supported</p>

        </form>

        {error && 
        <div className="mt-4 flex justify-center items-center">
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
            <div>
              <button className="btn btn-sm bg-error border-error text-error-content" onClick={() => {setError("")}}>Dismiss</button>
            </div>
          </div>
        </div>
        }

        <div className="mt-4 text-xl border-b">Files & Order</div>
        <Reorder.Group axis="y" values={files} onReorder={setFiles} className="mt-4">
          {files.map((file: any, idx: any) => (
            <Reorder.Item key={file.name} value={file} className="w-full">
              <FileCard file={file} idx={idx} removeFile={removeFile}/>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex flex-row items-center pt-4 w-full">
          <p className="w-full">Total Memory</p>
          <p className="w-1/12">{formatBytes(totalMemory)}</p>
        </div>

      </div>
    </div>
  )
}
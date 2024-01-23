import { ReadingFile } from "@prisma/client";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const titleLimit = 50; // 20 characters

type FileCardProps = {
  file: ReadingFile
  idx: number
  removeFile: any
}

export function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function FileCard(props: FileCardProps) {

  function formatTitle(title: string) {
    // Restrict to 50 characters
    if (title.length > titleLimit) {
      return title.substring(0, titleLimit) + "...";
    }
    return title;
  }

  return (
    <div key={props.idx} className="m-1 flex flex-row space-x-5 card bg-base w-full border-[2px] shadow-xl p-2 pr-4 pl-4">
      <span>{formatTitle(props.file.title)}</span>
      <div className="w-full flex justify-end items-center">
        <p className="pr-4">{formatBytes(props.file.size)}</p>
        <button className="btn btn-ghost btn-sm mr-4" onClick={() => props.removeFile(props.idx)}>
          <FontAwesomeIcon icon={faTrash} className='h-4' />
        </button>
      </div>
    </div>
  )
}
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type DictionaryEntryProps = {
  dictEntry: any
  setDictEntry: any
}

export function DictionaryEntry(props: DictionaryEntryProps) {

  // Get the word
  const word = props.dictEntry[0].word
  const partOfSpeech = props.dictEntry[0].meanings[0]
  const partOfSpeechType = partOfSpeech.partOfSpeech
  const definitions = partOfSpeech.definitions.slice(0, 3)

  return (
    <div className="alert alert-info">
      <div></div> {/* Empty div required */}
      <div className="flex justify-between w-full">
        <div>
          <div>
            <span className="text-2xl">{word}</span>
            <span className="italic">{`  ${partOfSpeechType}`}</span>
          </div>
          <div>
            {definitions.map((definition: any, index: number) => {
              return (
                <div key={index} className="text">
                  <span className="font-bold">{index + 1}</span>
                  <span>{`  ${definition.definition}`}</span>
                </div>
              )
            })}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => {props.setDictEntry(null)}}>
          <FontAwesomeIcon icon={faClose} className="fa-s"/>
        </button>
      </div>
    </div>
  )
}
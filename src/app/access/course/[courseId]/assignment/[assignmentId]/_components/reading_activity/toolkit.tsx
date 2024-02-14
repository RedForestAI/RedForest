import { useEffect, useRef, useState } from 'react';

type ToolKitProps = {
  x: number
  y: number
  w: number
  h: number
  isVisible: boolean
  onHighlight: (e: any) => {}
  onAnnotate: (e: any) => {}
  onLookup: (e: any) => {}
}

export const ToolKit = (props: ToolKitProps) => {
  const [position, setPosition] = useState({x: -100, y: -100});
  const toolkitRef = useRef(null); // Create a ref for the toolkit div

  useEffect(() => {
    if (props.isVisible && toolkitRef.current) {
      const { offsetWidth, offsetHeight } = toolkitRef.current;
      
      // Now you have width (offsetWidth) and height (offsetHeight) of the toolkit
      // Adjust x and y if needed based on these dimensions
      console.log(props)
      setPosition({x: props.x - offsetWidth/2 + props.w/2, y: props.y - offsetHeight - 5});
    }
    else {
      setPosition({x: -100, y: -100});
    }
  }, [props]);

  return (
    <>
    {props.isVisible &&
      <div ref={toolkitRef} className={`toolkit bg-primary w-[24] fixed flex flex-row gap-4 z-50`} style={{top: `${position.y}px`, left: `${position.x}px`}}>
        <button className="btn btn-ghost" onClick={props.onHighlight}>H</button>
        <button className="btn btn-ghost" onClick={props.onAnnotate}>A</button>
        <button className="btn btn-ghost" onClick={props.onLookup}>L</button>
      </div>
    }
    </>
  );
};

import { useEffect } from "react";

export default function GazeLogger() {

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      // Handle the event
      let newData = {x: event.detail.x, y: event.detail.y}
      console.log(newData)
    };
  
    // Add event listener
    document.addEventListener("gazeUpdate", handleCustomEvent);
  
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("gazeUpdate", handleCustomEvent);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (<></>)
}
import React from 'react';

export default function GazeDot(props: {x: number, y: number}){
  
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    left: '-5px',
    top: '-5px',
    background: 'red',
    borderRadius: '50%',
    opacity: 0.7,
    width: 20,
    height: 20,
    transform: `translate(${props.x}px, ${props.y}px)`,
  };

  return <div id="GazeDot" style={style}></div>;
};
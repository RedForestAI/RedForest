import React from 'react';

const CustomGazeDot: React.FC = () => {
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    left: '50%',
    top: '50%',
    background: 'red',
    borderRadius: '50%',
    opacity: 0.7,
    width: 20,
    height: 20,
    transform: 'translate(-50%, -50%)',
  };

  return <div id="customGazeDot" style={style}></div>;
};

export default CustomGazeDot;
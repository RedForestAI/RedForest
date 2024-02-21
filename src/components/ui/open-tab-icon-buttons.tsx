"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


interface IconButtonProps {
  icon: IconDefinition;
  url: string;
}

const OpenTabIconButton = ( props: IconButtonProps) => {

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <FontAwesomeIcon className="fa-2x" icon={props.icon} onClick={() => openInNewTab(props.url)}/>
  )
}

export default OpenTabIconButton;
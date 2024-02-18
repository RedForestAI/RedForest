import ReactDOM from "react-dom";
import React from "react";
import { triggerActionLog } from "~/loggers/actions-logger";

export type rectBtn = {
  onClick: () => void;
  color: string;
  rect: DOMRect;
  page: number;
}

type PageBtnLayerProps = {
  page: Element;
  component: React.ReactElement;
};

export function PageBtnLayer(props: PageBtnLayerProps) {

  // Get the page number
  const pageNumber = props.page.getAttribute("data-page-number");
  if (pageNumber == null) return null

  // Clone to pass additional props
  const component = React.cloneElement(props.component, { config: {pageNumber: Number(pageNumber) }});

  return ReactDOM.createPortal(
    <div
      id={`btnLayer_${pageNumber}`}
      className="absolute left-0 top-0 h-full w-full z-50"
    >
      {component}
    </div>,
    props.page,
  );
}

function RectBtn(props: { rectBtn: rectBtn}) {
  return (
    <div
      className="absolute cursor-pointer"
      style={{
        top: `${props.rectBtn.rect.top*100}%`,
        left: `${props.rectBtn.rect.left*100}%`,
        width: `${props.rectBtn.rect.width*100}%`,
        height: `${props.rectBtn.rect.height*100}%`,
        backgroundColor: props.rectBtn.color,
        zIndex: "45"
      }}
      onClick={props.rectBtn.onClick}
    ></div>
  );
}
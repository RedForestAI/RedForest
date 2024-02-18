import ReactDOM from "react-dom";
import { triggerActionLog } from "~/loggers/actions-logger";

export type rectBtn = {
  onClick: () => void;
  color: string;
  rect: DOMRect;
  page: number;
}

type PageBtnLayerProps = {
  page: Element;
  rectBtns: rectBtn[];
};

export function PageBtnLayer(props: PageBtnLayerProps) {

  // Get the page number
  const pageNumber = props.page.getAttribute("data-page-number");
  if (pageNumber == null) return null

  return ReactDOM.createPortal(
    <div
      id={`noteAnnotationLayer_${pageNumber}`}
      className="absolute left-0 top-0 h-full w-full"
    >
      {props.rectBtns
        .filter((rectBtn) => rectBtn.page == parseInt(pageNumber))
        .map((rectBtn, index) => (
          <RectBtn key={index} rectBtn={rectBtn}/>
        ))}
    </div>,
    props.page,
  );
}

function RectBtn(props: { rectBtn: rectBtn}) {
  return (
    <div
      className="absolute"
      style={{
        top: props.rectBtn.rect.top,
        left: props.rectBtn.rect.left,
        width: props.rectBtn.rect.width,
        height: props.rectBtn.rect.height,
        backgroundColor: props.rectBtn.color,
      }}
      onClick={props.rectBtn.onClick}
    ></div>
  );
}
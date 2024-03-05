import ReactDOM from 'react-dom'

type HeatmapOverlayProps = {
  page?: Element;
}

export default function HeatmapOverlay(props: HeatmapOverlayProps) {
  if (!props.page) return null

  return ReactDOM.createPortal(
    <div
      id={`heatmapOverlay`}
      className="absolute left-0 top-0 h-full w-full z-50"
    >
    </div>,
    props.page,
  )
}
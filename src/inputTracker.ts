import mitt, { Emitter } from 'mitt'

// Reference: 
// https://codepen.io/jtangelder/pen/XWZxGP

export default class InputTracker {
  emitter: Emitter<any>
  hammer?: any

  constructor(emitter: Emitter<any>) {

    // Initial values of state variables
    this.emitter = emitter

    // Add event tracking of mouse information
    document.addEventListener('mousemove', (event: MouseEvent) => {this.mouseMove(event)}, false)
    document.addEventListener('mousedown', (event: MouseEvent) => {this.mouseDown(event)}, false)

    if (window.visualViewport != null){
      window.visualViewport.addEventListener('resize', (event) => {this.gestureEnd(event)})
    }
    
  }

  mouseMove (event: MouseEvent) {
    // console.log("Mouse: (" + event.x + "," + event.y + ")")
    this.emitter.emit("mouse", {event: 'move', x: event.x, y: event.y})
  }

  mouseDown (event: MouseEvent) {
    // console.log("Mouse Down: (" + event.x + "," + event.y + ")")
    this.emitter.emit('mouse', {event: 'down', x: event.x, y: event.y})
  }

  gestureEnd (event) {
    // console.log(event)
    this.emitter.emit('touch', {event: 'pinch', viewport: event.srcElement})
  }
}

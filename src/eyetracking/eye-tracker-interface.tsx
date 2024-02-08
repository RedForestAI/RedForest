import { TobiiClient } from "tobiiprosdk-js";
import { WebGazerManager } from "./WebGazerManager"

type EyeTrackerProps = {
  setRunningET: (runningET: boolean) => void;
  setCalibration: (calibration: boolean) => void;
}

type EyeTracker = {
  address: string;
  model: string;
  name: string;
  serial_number: string;
}

export class AbstractEyeTracker {
  props: EyeTrackerProps;

  constructor(props: EyeTrackerProps) {
    // Store the props
    this.props = props;
  }

  async getOption(): Promise<string[]> {
    return [];
  }

  getStatus(runningET: boolean) {
    return <></>;
  }

  getButton(runningET: boolean) {
    return <></>;
  }

  getCalibrationButton(runningET: boolean) {
    return <></>
  }

  config(config: any | null) {
    return null
  }

  calibrate() {
    return null;
  }

  show() {
    return null;
  }

  hide() {
    return null;
  }

  end() {
    return null;
  }
}

export class WebGazeEyeTracker extends AbstractEyeTracker {
  webGazer: WebGazerManager;

  constructor(props: EyeTrackerProps) {
    super(props);
    this.webGazer = new WebGazerManager();
  }

  async getOption(): Promise<string[]> {
    return ["WebGazer"]
  }

  getStatus(runningET: boolean) {
    if (runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    return (
      <p className="ml-2">Ready</p>
    )
  }

  getButton(runningET: boolean) {
    if (runningET) {
      return (
        <button className="btn btn-error w-5/12" onClick={() => {this.stop()}}>Stop</button>
      )
    }
    return (
      <button className="btn btn-primary w-5/12" onClick={() => {this.start()}}>Start</button>
    )
  }

  getCalibrationButton(runningET: boolean) {
    return <button className="btn btn-primary" disabled={!runningET} onClick={() => {this.calibrate()}}>Calibrate</button>
  }

  start() {
    this.webGazer.start();
    this.props.setRunningET(true);
  };

  stop() {
    this.webGazer.restart();
    this.props.setRunningET(false);
  };

  config(config: any | null) {
    return null
  }

  calibrate() {
    // @ts-ignore
    document?.getElementById('wgcalibration')?.showModal()
    this.props.setCalibration(true);
    return null;
  }

  show() {
    return null;
  }

  end() {
    this.webGazer.restart();
    return null;
  }
}

export class TobiiProSDKEyeTracker extends AbstractEyeTracker {
  tobii: TobiiClient;
  serial_number: string | null;
  ws: WebSocket | null;

  constructor(props: EyeTrackerProps) {
    super(props);
    this.tobii = new TobiiClient();
    this.serial_number = null;
    this.ws = null;
  }

  async getOption(): Promise<string[]> {
    let ets: EyeTracker[] = []
    try {
      ets = await this.tobii.getEyeTrackers();
    } catch (e) {
      return [];
    }

    // Format the options to nice strings
    return ets.map((et: EyeTracker) => {
      return et.name + " - " + et.serial_number;
    });
  }

  getStatus(runningET: boolean) {
    if (runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    return (
      <p className="ml-2">Ready</p>
    )
  }

  getButton(runningET: boolean) {
    if (runningET) {
      return (
        <button className="btn btn-error w-5/12" onClick={() => {this.stop()}}>Stop</button>
      )
    }
    return (
      <button className="btn btn-primary w-5/12" onClick={() => {this.start()}}>Start</button>
    )
  }

  getCalibrationButton(runningET: boolean) {
    return <></>
  }

  async start() {
    // console.log(`Starting Tobii - ${this.serial_number}`)
    this.props.setRunningET(true);

    // Check for the serial number
    if (this.serial_number == null) {
      console.error("No serial number set for Tobii")
      return;
    }

    // Start the tobii
    // @ts-ignore
    this.ws = await this.tobii.connectToEyeTracker(this.serial_number!);

    // Correct way to set event listeners on WebSocket
    this.ws!.onmessage = (event: any) => {
      let event_data = JSON.parse(event.data)
      try {
        let gaze = JSON.parse(event_data).value.gaze_data.left

        // Convert the relative gaze position to absolute position
        let x = window.innerWidth * gaze[0]
        let y = window.innerHeight * gaze[1]
        // console.log({x, y})

        // Create custom event & dispatch
        const event = new CustomEvent("gazeUpdate", {detail: {x, y}});
        document.dispatchEvent(event);

      } catch (e) {
        return
      }
    };

    this.ws!.onerror = (event: any) => {
        console.error("WebSocket error:", event);
    };

    this.ws!.onopen = () => {
        console.log("WebSocket connection established");
    };

    this.ws!.onclose = () => {
        console.log("WebSocket connection closed");
    };
  }

  stop() {
    console.log("Stopping Tobii")
    this.props.setRunningET(false);
    this.ws!.close();
  }

  config(config: any | null) {
    // Get the serial number by itself
    this.serial_number = config.split(" - ")[1];
    return null
  }

  calibrate() {
    return null;
  }

  show() {
    return null;
  }

  end() {
    if (this.ws) {
      this.ws.close();
    }
    return null;
  }
}
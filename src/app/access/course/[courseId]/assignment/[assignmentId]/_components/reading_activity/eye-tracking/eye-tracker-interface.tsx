import { TobiiClient } from "tobiiprosdk-js";
import { WebGazerManager } from "~/providers/WebGazerManager"

type EyeTrackerProps = {
  connected: boolean;
  runningET: boolean;
  setConnected: (connected: boolean) => void;
  setRunningET: (runningET: boolean) => void;
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

  getStatus() {
    return <></>;
  }

  getButton() {
    return <></>;
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

  getStatus() {
    if (this.props.runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    return (
      <p className="ml-2">Ready</p>
    )
  }

  start() {
    this.webGazer.start();
    this.props.setRunningET(true);
  };

  stop() {
    this.webGazer.restart()
    this.props.setRunningET(false);
  };

  getButton() {
    if (this.props.runningET) {
      return (
        <button className="btn btn-error w-5/12" onClick={stop}>Stop</button>
      )
    }
    return (
      <button className="btn btn-primary w-5/12" onClick={stop}>Start</button>
    )
  }

  calibrate() {
    // @ts-ignore
    document?.getElementById('wgcalibration')?.showModal()
    // setCalibration(true);
    return null;
  }

  show() {
    return null;
  }

  end() {
    return null;
  }
}

export class TobiiProSDKEyeTracker extends AbstractEyeTracker {
  tobii: TobiiClient;

  constructor(props: EyeTrackerProps) {
    super(props);
    this.tobii = new TobiiClient();
  }

  async getOption(): Promise<string[]> {
    let ets: EyeTracker[] = []
    try {
      ets = await this.tobii.getEyeTrackers();
    } catch (e) {
      console.error(e);
      return [];
    }

    // Format the options to nice strings
    return ets.map((et: EyeTracker) => {
      return et.name + " - " + et.serial_number;
    });
  }

  getStatus() {
    if (this.props.runningET) {
      return (
        <p className="ml-2 text-success">Running</p>
      )
    }
    if (this.props.connected) {
      return (
        <p className="ml-2">Connected</p>
      )
    }
    return (
      <p className="ml-2 text-error">Not Found</p>
    )
  }

  getButton() {
    if (this.props.runningET) {
      return (
        <button className="btn btn-error w-5/12">Stop</button>
      )
    }
    if (this.props.connected) {
      return (
        <button className="btn btn-primary w-5/12">Start</button>
      )
    }
    return (
      <button className="btn btn-secondary w-5/12">Connect</button>
    )
  }

  calibrate() {
    return null;
  }

  show() {
    return null;
  }

  end() {
    return null;
  }
}
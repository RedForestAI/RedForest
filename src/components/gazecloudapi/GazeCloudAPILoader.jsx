import React, { useState, useEffect, useContext } from 'react';
import Script from 'react-load-script';
import { WebGazeContext } from './WebGazeContext';

const GazeCloudAPILoader = () => {
    const [context, setContext] = useState({ x: -1, y: -1 });

    useEffect(() => {
        const processGaze = (GazeData: IGazeData) => {
            const x_ = GazeData.docX;
            const y_ = GazeData.docY;
            document.getElementById("gazeX").innerHTML = x_.toString();
            document.getElementById("gazeY").innerHTML = y_.toString();

            setContext({ x: x_, y: y_ });

            const gaze = document.getElementById("gaze");
            gaze.style.left = `${x_ - gaze.clientWidth / 2}px`;
            gaze.style.top = `${y_ - gaze.clientHeight / 2}px`;

            gaze.style.display = GazeData.state !== 0 ? 'none' : 'block';
        };

        window.GazeCloudAPI = window.GazeCloudAPI || {};
        window.GazeCloudAPI.OnCalibrationComplete = () => console.log('gaze Calibration Complete');
        window.GazeCloudAPI.OnCamDenied = () => console.log('camera access denied');
        window.GazeCloudAPI.OnError = (msg) => console.log('err: ' + msg);
        window.GazeCloudAPI.UseClickRecalibration = true;
        window.GazeCloudAPI.OnResult = processGaze;
    }, []);

    const handleScriptLoad = () => {
        console.log('Script loaded successfully!');
    };

    const handleScriptError = () => {
        console.log('Script loading Error!');
    };

    return (
        <WebGazeContext.Provider value={context}>
            <Script
                url="https://api.gazerecorder.com/GazeCloudAPI.js"
                onLoad={handleScriptLoad}
                onError={handleScriptError}
            />
            <button onClick={() => window.GazeCloudAPI.StartEyeTracking()}> Calibrate </button>
            <button onClick={() => window.GazeCloudAPI.StopEyeTracking()}> Stop Tracking </button>
        </WebGazeContext.Provider>
    );
};

export default GazeCloudAPILoader;

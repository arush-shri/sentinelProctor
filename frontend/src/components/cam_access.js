import Webcam from "react-webcam";
import React, { useCallback, useRef, useState } from "react";

function WebCamAccess(){
    const vidConstraint = {
        width: 400,
        height: 400,
        facingMode: "user"
    };

    const [capturing, setCapturing] = useState(false);
    const [img, setImg] = useState(null);
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
            console.log("Data available:", data);
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const startCapture = useCallback(() => {
        console.log("Starting capture");
        setCapturing(true);
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);

        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm",
          });

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
          
        mediaRecorderRef.current.start();
    }, [handleDataAvailable]);

    const stopCapture = useCallback(() => {
        console.log("Stopping capture");
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, []);

    return (
        <div>
            <Webcam 
                audio={true}
                screenshotFormat="image/jpeg"
                videoConstraints={vidConstraint}
                mirrored={false}
                imageSmoothing={true}
                height={400}
                width={400}
                ref={webcamRef}
            />
            {capturing ? (
                <button onClick={stopCapture}>Stop Capture</button>
            ) : (
                <button onClick={startCapture}>Start Capture</button>
            )}
            {img && <img src={img} alt="screenshot" />}
        </div>
    );
}

export default WebCamAccess;

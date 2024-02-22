import ReactPlayer from 'react-player';
import React, { useCallback, useState } from "react";

function WebCamAccess(){

    const [streamChunks, setStreamChunks] = useState();
    const [screenStream, setScreenStream] = useState();

    const startStream = useCallback( async () => {
        let All_mediaDevices=navigator.mediaDevices
        if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
           console.log("getUserMedia() not supported.");
           return;
        }
        All_mediaDevices.getUserMedia({
           audio: true,
           video: true
        })
        .then(function(vidStream) {
            console.log(vidStream)
            setStreamChunks(vidStream);
           
        })
        .catch(function(e) {
           console.log(e.name + ": " + e.message);
        });
    }, [setStreamChunks]);
    
    const startCapture = useCallback( async () => {
        let captureStream = null;
        const displayMediaOptions = {
            video: {
              cursor: "always",
              displaySurface: "monitor",
            },
            audio: true,
        };

        try {
            captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            const tracks = captureStream.getVideoTracks();
            const audioTracks = captureStream.getAudioTracks();
            if (tracks.length > 0) {
                const track = tracks[0];
                const settings = track.getSettings();
                if (settings.displaySurface === 'monitor' && audioTracks.length > 0) {
                    setScreenStream(captureStream);
                } else {
                    alert("Please select the entire screen with audio.");
                    startCapture();
                }
            } else {
                console.error('No video tracks found in the stream.');
            }
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }, [setScreenStream]);

    return (
        <div>
            <button onClick={startStream}>Start Capture</button>
            <button onClick={startCapture}>Screen Capture</button>
            {
                streamChunks && 
                <ReactPlayer 
                    width="400px" 
                    height= "400px"
                    playing
                    muted
                    url={streamChunks}
                />
            }
            {
                screenStream && 
                <ReactPlayer 
                    width="400px" 
                    height= "400px"
                    playing
                    muted
                    url={screenStream}
                />
            }
        </div>
    );
}

export default WebCamAccess;

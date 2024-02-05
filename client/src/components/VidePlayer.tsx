import { useEffect, useRef } from "react";
import { Stream } from "stream";

export const VideoPlayer:React.FC<{stream:MediaStream}>=({stream})=>{
    const videoRef=useRef<HTMLVideoElement>(null);
    // use useEffect on every time we get stream
    useEffect(()=>{
        // as videoRef might be undefined so check if statement for videoRef 
        if(videoRef.current) videoRef.current.srcObject=stream;


    },[stream])
    return(
        <video ref={videoRef} autoPlay muted={true}/>

    );
}
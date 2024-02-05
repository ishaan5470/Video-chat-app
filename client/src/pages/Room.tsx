//in this we want our use to know in which room we are in we will use useParams which helps us to get data from our url which id we go to 
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext, RoomProvider } from "../context/RoomContext";
import { VideoPlayer } from "../components/VidePlayer";
import { PeerState } from "../context/PeerReducer";
import { ShareScreenButton } from "../components/ShareScreenButton";
const Room=()=>{
    const {id}=useParams();
    //for user with the same link join the room we will use "ws" from our room context 
    const {ws,me,stream,peers,shareScreen }=useContext(RoomContext)
    //on every id change  
    useEffect(()=>{
        if (me && me._id) {
        ws.emit("join-room",{roomId:id,peerId:me._id})
        }
        // console.log(me, "me>>>>>>>>>>>>")
        console.log(id,"room id it is ")
        console.log(me && me._id,"peer id it is ")
       

    } ,[id, me,ws ]) 
    return(
        <>
            Room ${id}
            <div className="grid grid-cols-4 gap-4 rounded-full" >
                <VideoPlayer stream={stream}/>
                {/* {Object.values(peers as PeerState).map((peer,index)=>(
                 

                    <VideoPlayer stream={peer.stream} key={index}/>
                    
                ))} */}
                 hahaaa
        
            </div>
            <div className="fixed bottom-0 flex justify-center w-full b-t-2">
                <ShareScreenButton onClick={shareScreen}/>
            </div>
        </>
    )
}
export default Room;
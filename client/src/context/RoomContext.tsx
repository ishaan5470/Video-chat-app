import {  createContext, useEffect, useState } from "react";
import { useReducer } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./PeerReducer";
import { addPeerAction, removePeerAction } from "./PeerActions";
import { error } from "console";

const WS= "http://localhost:8000";


export const RoomContext=createContext<null | any>(null)
//connecting our websocket
const ws=socketIOClient(WS);

//export roomProvider from this file 
export const RoomProvider:any=({children}:any)=>{

    // using useReducer we will return two variables first one will be the state that is peers and second one is dispatch
    const [peers,dispatch]=useReducer(peersReducer,{});  





    const navigate=useNavigate();
    //make state that represent out cuurent peer and this variable is a type peer coming from peerjs 

    const [me,setMe]=useState<Peer>();
    const [stream,setStream]=useState<MediaStream>(); 
    const [screenSharingId,setScreenSharingId]=useState<string>("");
    const getUsers=({participants}:{participants:string[]})=>{
        console.log(participants,"particpants>>>>>");
        }
    const enterRoom=({roomId}:{roomId:"string"})=>{
      
        console.log({roomId},"here is the room id ");
        navigate(`/room/${roomId}`);
    }

    //function for removing peer 
    const removePeer=(peerId:string)=>{
        dispatch(removePeerAction(peerId))

    }

    const switchStream=(stream:MediaStream)=>{
        setStream(stream);
        setScreenSharingId(me?.id|| "")
        //we need to go to every peer in the room and replace the stream we are sending  with the new stream  

        // first we will get all connections of current user using me.connection
        // if (me?.connections) {
        //     Object.values(me.connections).forEach((connection: any) => {
        //       const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
        //       connection[0].peerConnection.getSenders()[1]
        //         .replaceTrack(videoTrack)
        //         .catch((error: any) => console.log(error));
        //     });
        //   } else {
        //     console.error("No connections found");
        //   }

    }

    //function to share screen
    const shareScreen=()=>{

        //we want to check if we have screensharing id then we already sharing screen then i need to switch back to my video
        if(screenSharingId){
             //instead of getUSermeida we will use getDisplayMedia
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(switchStream)


        }
        else{
             //instead of getUSermeida we will use getDisplayMedia
        navigator.mediaDevices.getDisplayMedia({}).then(switchStream)

        }
        

       

    }





    
    useEffect(()=>{
        console.log("room is joined");
        const meId=uuidV4();
        const peer=new Peer(meId);

        setMe(peer)
        try {
            navigator?.mediaDevices?.getUserMedia({video:true,audio:true}).then((stream)=>{
                setStream(stream);
                console.log("this is my stream", stream)
            })
            
        } catch (error) {
            console.log(error);
            
        }
        ws.on("room-created",enterRoom);
        ws.on("get-users",getUsers);
        ws.on("user-disconnected",removePeer);
        // ws.on("")
    },[]);

    //when we get our stream we need to call every peer in our room and they will send them there own stream to the room this is how peer to peer connetion works 
    useEffect(()=>{
        if(!me) return;
        if(!stream) return;
        //is we have both we will listen "user-joined" and also emit this even on our index.js in our server 
       
        const calls = [];
        ws.on("user-joined",({peerId})=>{ 
          
            //create call using peerobject 
            //here we are initiating the call and sending our stream
            
          

            const call=me.call(peerId,stream)
            calls.push({ peerId, call });
          
            
            //when our peer starts streams we dispatch an action 
            call.on("stream",(peerStream)=>{
                console.log("check chckec ????????????????")
            
                dispatch(addPeerAction(peerId,peerStream));
                console.log("this is calling functionality >>>>>>>>>>>>")
            })

        });
        me.on('call',(call)=>{
            //answering peer's call and sending our stream to them 
            console.log("call thingy working")

            call.answer(stream);
            //here in case of peerId we use call.peer (id of the person who is calling)

            call.on("stream",(peerStream)=>{
                dispatch(addPeerAction(call.peer,peerStream))
            })
        })

    },[me,stream ])

  console.log({peers}, "these are my peers who joined")

    return(
    <RoomContext.Provider value={{ws,me,stream,peers,shareScreen}}>
        {children}
        
    </RoomContext.Provider>  
    );
}
import { Socket } from "socket.io";
import {v4 as uuidV4} from "uuid";

interface IRoomParams{
    roomId:string,
    peerId:string

}

// we will create variable which contain the list of our rooms
const rooms:Record<string,string[]>={}




export const RoomHandler=(socket:Socket)=>{
    // making a function for create room
    const createRoom=()=>{
        const roomId=uuidV4();
        rooms[roomId]=[];
        socket.join(roomId);
        socket.emit("room-created",{roomId})
        console.log("user created the room")

    }
    const joinRoom=({roomId,peerId}:IRoomParams)=>{
        if (rooms[roomId]){


        console.log("user joined the room",roomId,peerId)
        rooms[roomId].push(peerId);


        socket.join(roomId);
        // on every user joined to the room
        socket.to(roomId).emit("user-joined", {
            peerId,

        })
        socket.emit("get-users" ,{
            roomId,
            participants:rooms[roomId]
        })
    }
    socket.on("disconnect",()=>{
        console.log("user left the room", peerId);
        LeaveRoom({roomId,peerId}); // we pass roomId and peerId to know which room to remove which peer

    })
}

const LeaveRoom = ({ peerId, roomId }: IRoomParams) => {
    if (rooms[roomId]) { // Check if rooms[roomId] is defined
        rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
        // Emit the event to the room
        socket.to(roomId).emit("user-disconnected", peerId);
    } else {
        console.error(`Room with ID ${roomId} does not exist or is not initialized.`);
    }
}

const startSharing=({peerId,roomId}:IRoomParams)=>{
    // send to every peer in the room that
    socket.to(roomId).emit("user-start-sharing",peerId)

}
const stopSharing=(roomId:string)=>{
    socket.to(roomId).emit("user-stop-sharing")
}

    // all the events happening
    socket.on("create-room", createRoom)
    socket.on("join-room", joinRoom)
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);


}
import { useContext } from "react"
import { RoomContext } from "../context/RoomContext"

export const JoinButton:React.FunctionComponent=()=>{
    const {ws}=useContext(RoomContext)
    const createRoom=()=>{
        //emit the message to our server that i want join-room
        ws.emit("create-room")
        console.log("button is clicked")
    }
    return(
        <>
        <button onClick={createRoom} className='bg-rose-300 rounded-lg hover:bg-rose-500 px-4 py-2 text-lg text-white'>
        start a meeting
      </button>
        </>

    )
}
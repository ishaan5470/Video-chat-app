import { ADD_PEER,REMOVE_PEER } from "./PeerActions";
 export type PeerState=Record<string,{stream:MediaStream}>;
type PeerAction=
|
{
    type:typeof ADD_PEER;
    payload:{peerId:string; stream:MediaStream};
}
|
{
    type:typeof REMOVE_PEER;
    payload:{peerId:string}
}

//now write a our peer reducer 
export const peersReducer=(state:PeerState,action:PeerAction)=>{
    switch (action.type) {
        case ADD_PEER:
            //we will add a new peer with existing one 
            
            return{
                ...state,
            [action.payload.peerId]:{
                stream:action.payload.stream,
            },
        };
    
       case REMOVE_PEER:
        //we will filter our state and get rid of the peer we want to remove using ES6 syntax
        const {[action.payload.peerId]:deleted,...rest} =state;
        return rest;
        
        default:
            return {...state};
    }
}
//after making reducer use the peerReducer in the context and use useReducer hook

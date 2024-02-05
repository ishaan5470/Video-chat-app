import React, { useEffect } from 'react';

import './App.css';

import { RoomProvider } from './context/RoomContext';
import { JoinButton } from './components/JoinButton';



function App() {

  //in use Effect when our application is mounted we will connect to the server 


  return (

    <div className="App flex  justify-center items-center w-screen h-screen">
      <JoinButton />


    </div>


  );
}


export default App;

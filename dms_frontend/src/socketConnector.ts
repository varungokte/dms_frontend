import {socket} from "./socket";


const onConnect = (setSocketIsConnected:Function) => {
  try{
    setSocketIsConnected(true);
    socket.emit("sendMessage", {message:"Connection established"})
    //console.log("CONNECTED");
    socket.emit("subscribe", "BusinessChannel");
  }
  catch(err){}
}

const onDisconnect = (setSocketIsConnected:Function) => {
  setSocketIsConnected(false);
}

const socketConnector = (setSocketIsConnected:Function) => {
  try{
    socket.on("connect", ()=>onConnect(setSocketIsConnected));
    socket.on("connect_error",()=>{	
      console.log("socketerror")
    });
    socket.on("connect_failed", ()=>{
      console.log("socketfailed")
    } )
    socket.on("disconnect", ()=>onDisconnect(setSocketIsConnected));
    socket.on("messageReceived", ()=>{
      //console.log("RECIEVE",data)
    })  
  }
  catch(e){console.log("socker error",e)}
}

export default socketConnector;
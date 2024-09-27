import { SetStateBoolean } from "@/types/DataTypes";
//import socket from "./socket";
import { Socket } from "socket.io-client";

const onConnect = (socket:Socket,setSocketIsConnected:SetStateBoolean) => {
  try{
    setSocketIsConnected(true);
    //console.log("socket is connected");
    //console.log("socket.id",socket.id);
    socket.emit("sendMessage", {message:"Connection established"})
    socket.emit("subscribe", "BusinessChannel");
  }
  catch(err){}
}

const onDisconnect = (setSocketIsConnected:SetStateBoolean) => {
  setSocketIsConnected(false);
}

const onSocketError = () => {	
  console.log("socketerror");
}

const checkSocketIsConnected = () =>{
  return  //socket.connected;
}

const socketConnector = (socket:Socket,setSocketIsConnected:SetStateBoolean) => {
  try{
    socket.on("connect", ()=>onConnect(socket,setSocketIsConnected));
    
    socket.on("connect_error",()=>onSocketError());
    
    socket.on("disconnect", ()=>onDisconnect(setSocketIsConnected));
  
    socket.on("connect_failed", ()=>{
      console.log("socketfailed")
    })
    socket.on("messageReceived", ()=>{
      //console.log("RECIEVE",data)
    });
  }
  catch(e){console.log("socker error",e)}
}

export {socketConnector, checkSocketIsConnected};
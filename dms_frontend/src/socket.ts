import {io} from "socket.io-client";
import useGlobalContext from "./../GlobalContext";

const {getEncryptedToken} = useGlobalContext();
const token =  getEncryptedToken();

//const Base_Url = "http://139.5.190.208:9000";
const Base_Url = "http://192.168.1.9:9000";
const socket = io(Base_Url, {
  query:{ data: token }
})

export {socket} ;
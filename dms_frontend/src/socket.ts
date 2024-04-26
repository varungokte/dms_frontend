import {io} from "socket.io-client";
import useGlobalContext from "./../GlobalContext";

const {getEncryptedToken} = useGlobalContext();
const token =  getEncryptedToken();

const socket = io("http://192.168.1.9:3000", {
  query:{ data: token }
})

export {socket} ;
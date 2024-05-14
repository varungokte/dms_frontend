import {io} from "socket.io-client";
import useGlobalContext from "./../GlobalContext";

const {getEncryptedToken} = useGlobalContext();
const token =  getEncryptedToken();

const socket = io("https://dms-pbe2.onrender.com", {
  query:{ data: token }
})

export {socket} ;
import {io} from "socket.io-client";
import { getEncryptedToken } from "./functions/getToken";

//import { ServerUrl } from "./Constants";
const ServerUrl =/* "http://139.5.190.208:9000" */ import.meta.env.VITE_APP_SERVER_URL;

const token =  getEncryptedToken();
const socket = io(ServerUrl, {
  query:{ data: token },
})

//console.log("socket.ts",socket);

export default socket;

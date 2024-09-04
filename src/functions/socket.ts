import {io} from "socket.io-client";
import { getEncryptedToken } from "./getToken";
import { ServerUrl } from "./Constants";

const token =  getEncryptedToken();

const socket = io(ServerUrl, {
  query:{ data: token }
})

export {socket} ;
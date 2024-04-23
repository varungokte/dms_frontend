import {io} from "socket.io-client";

const token =  localStorage.getItem("Beacon-DMS-token");
const _userId = localStorage.getItem("Beacon-DMS-userid")

export const socket = io("http://192.168.1.9:3000", {
  //@ts-ignore
  query:{
    token: token,
    _userId: _userId
  }
});
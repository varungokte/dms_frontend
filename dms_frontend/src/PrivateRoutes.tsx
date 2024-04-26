import { Navigate } from "react-router-dom";
import useGlobalContext from "../GlobalContext";
import { MenuRouter } from "./MenuRouter";
import { useEffect, useState } from "react";

function PrivateRoutes(){
  const [token, setToken] = useState<any>(null);  
  const {getDecryptedToken} = useGlobalContext();
  useEffect(()=>{
    getDecryptedToken().then(token=>{
      setToken(token);
    });
  },[])
  if (token)
    return <EmailVerification token={token} />
  else
    return <></>
}

function EmailVerification(props:any){
  if (!props.token){
    return <Navigate to="/login"/>}
  return props.token["S"]==2?<MenuRouter />:<Navigate to="/verify"/>
}

export default PrivateRoutes;

//User Status
//1 - Unverified
//2 - Active
//3 - Inactive
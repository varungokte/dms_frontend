import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { getDecryptedToken } from "./functions/getToken";
import { UserStatusList } from "./functions/Constants";
import { FieldValues } from "@/types/DataTypes";
import { SocketContext } from "./functions/Contexts";
import socket from "./functions/socket";

import VerificationPage from "./components/AuthPages/VerificationPage";
import MenuRouter from "./MenuRouter";

function PrivateRoutes() {
  const [token, setToken] = useState<any>(null);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (!check){
      getDecryptedToken().then((resToken: any) => {
        setCheck(true);
        if (resToken){
          setToken(resToken);
        }
      }).catch(() => {})
    }
  }, [check]);

  //console.log("rendering PrivateRoutes","check",check);
    
  if (!check)
    return <></>;
  else if (!token)
    return <Navigate to="/login" />
  else
    return <EmailVerification token={token} setCheck={setCheck} />
}

function EmailVerification(props:{token:FieldValues, setCheck:Function}) {
  //console.log("email verification token",props.token["S"]==UserStatusList[2])
  if (!props.token)
    return <Navigate to="/login" />
  else if (props.token["S"] == UserStatusList[2])
    return <MenuRouter />
   
  else
    return (
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/verify" element={<VerificationPage setCheck={props.setCheck} />} />
        </Routes>
        <Navigate to="/verify" />
      </SocketContext.Provider>
    )
}

export default PrivateRoutes;
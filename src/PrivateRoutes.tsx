import { Navigate, Route, Routes } from "react-router-dom";
import useGlobalContext from "./functions/GlobalContext";
import  MenuRouter from "./MenuRouter";
import { useEffect, useState } from "react";
import VerificationPage from "./components/AuthPages/VerificationPage";
import { UserStatusList } from "./functions/Constants";
import { FieldValues } from "@/types/DataTypes";

function PrivateRoutes() {
  const [token, setToken] = useState<any>(null);
  const [check, setCheck] = useState(false);
  const { getDecryptedToken } = useGlobalContext();

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
      <>
        <Routes>
          <Route path="/verify" element={<VerificationPage setCheck={props.setCheck} />} />
        </Routes>
        <Navigate to="/verify" />
      </>
    )
}

export default PrivateRoutes;

//User Status
//1 - Unverified
//2 - Active
//3 - Inactive
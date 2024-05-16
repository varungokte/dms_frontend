import { Navigate, Route, Routes } from "react-router-dom";
import useGlobalContext from "../GlobalContext";
import { MenuRouter } from "./MenuRouter";
import { useEffect, useState } from "react";
import VerificationPage from "./components/AuthPages/VerificationPage";

function PrivateRoutes(){
  const [token, setToken] = useState<any>(null);  
  const {getDecryptedToken} = useGlobalContext();
  useEffect(()=>{
    getDecryptedToken().then((resToken:any)=>{
      if (JSON.stringify(token)===JSON.stringify(resToken)){
        return}
      if (resToken)
        setToken(resToken);
      else
        setToken("INVALID");
    }).catch(()=>{
      setToken("INVALID");
    })
  },[token]);

  if (token=="INVALID")
    return <Navigate to="/login"/>
  else if (token)
    return <EmailVerification token={token} />
  else
    return <></>
}

function EmailVerification(props:any){
  useEffect(()=>{
    console.log("WERE here in email verify",props)
  })
  if (!props.token)
    return <Navigate to="/login"/>
  if (props.token["S"]==2){
    return <MenuRouter />
  }
  else
    return (
    <>
      <Routes>
        <Route path="/verify" element={<VerificationPage/>} />
      </Routes>
      <Navigate to="/verify"/>
    </>
      
  )
}

export default PrivateRoutes;

//User Status
//1 - Unverified
//2 - Active
//3 - Inactive
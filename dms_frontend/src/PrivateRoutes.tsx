import { Navigate } from "react-router-dom";
import useGlobalContext from "../GlobalContext";
import { MenuRouter } from "./MenuRouter";

function PrivateRoutes(){
  const token = useGlobalContext().isLoggedIn();
  console.log("ARKHAM", token)
  const { isLoggedIn } = useGlobalContext();
  return isLoggedIn()? <EmailVerification token={token} />: <Navigate to="/login" />
}

function EmailVerification(props:any){
  return (props.token["EV"]===1)?<MenuRouter />:<Navigate to="/verify"/>
}



export default PrivateRoutes;
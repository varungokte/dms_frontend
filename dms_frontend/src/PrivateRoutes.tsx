import { Navigate } from "react-router-dom";
import useGlobalContext from "../GlobalContext";
import { MenuRouter } from "./MenuRouter";

function PrivateRoutes(){
  const token = useGlobalContext().isLoggedIn();
  const { isLoggedIn } = useGlobalContext();
  return isLoggedIn()? <EmailVerification token={token} />: <Navigate to="/login" />
}

function EmailVerification(props:any){
  return (props.token["S"]===2)?<MenuRouter />:<Navigate to="/verify"/>
}



export default PrivateRoutes;


//User Status
//1 - Unverified
//2 - Active
//3 - Inactive
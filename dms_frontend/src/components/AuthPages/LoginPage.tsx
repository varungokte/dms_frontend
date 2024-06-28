import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";

import login_img from "./../static/login_img.png";
import eye from "./../static/eye.svg";
import eye_slash from "./../static/eye-slash.svg";

export const LoginPage = () => {
  useEffect(()=>{
		document.title="Login | Beacon DMS"
	},[]);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(<></>);

	const navigate = useNavigate();
	const { LoginUser } = useGlobalContext();
	const handleRegister = (e: FormEvent) => {
		e.preventDefault();

		if (email===""){
      setErrorMessage(<p className="text-red-600">Email is required</p>)
      return;
    }
    if (password===""){
      setErrorMessage(<p className="text-red-600">Password is required</p>);
      return;
    }

		const data = {
			E: email,
			P: password
		}

		LoginUser(data)
			.then((res:any) => {
        if (res==401 || res==412){
          setErrorMessage(<p className="text-red-600">Incorrect Username or Password</p>)
          return;
        }
        if (res==409)
          setErrorMessage(<p className="text-red-600">Inactive User. Contact your administrator.</p>)
        else{
          console.log("NAVIGAING TO DASHOARD")
          navigate('/')
        }
			})
	}

	return (		
    <div className="flex flex-row">
      <div style={{marginTop:"3%",}}>
        <img src={login_img} width={"80%"} style={{float:"right", paddingRight:"5%"}}/>
      </div>
      <div className="m-3" style={{marginTop:"7%", marginLeft:"5%", width:"35%"}}>
        <p className="text-4xl font-bold mb-7 mx-12" style={{color:"slateblue"}}>Welcome Back!</p>
        <form onSubmit={handleRegister}>
          <label htmlFor="email" className="font-light">Email Address</label>
          <br/>
          <input id="email" type="text" style={{height:"50px", width:"100%", borderRadius:"12px", paddingLeft:"3%"}} onChange={(e)=>setEmail(e.target.value)}/>
          <br/>
          <br/>
          
          <label htmlFor="password" className="font-light">Password</label>
          <br/>
          <div className="flex flex-row">
            <div style={{height:"50px", width:"130%", borderRadius:"12px"}}>
              <input id="password" type={showPassword?"text":"password"} style={{height:"50px", width:"100%", borderRadius:"12px 0px 0px 12px", paddingLeft:"3%"}} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div style={{float:"right", backgroundColor:"white", paddingTop:"13px", paddingRight:"5px", borderRadius:"0px 12px 12px 0px"}}><img src={showPassword?eye:eye_slash} width={"30px"} onClick={()=>setShowPassword((curr)=>{return !curr})}/></div>
          </div>
          <br/>
          <div className="flex flex-row relative">
            <div style={{marginRight:"55%"}}>
              {/* <input type="checkbox" id="remember"/>
              <label htmlFor="remember">Remember me</label> */}
            </div>
          </div>
          <br/>
          {errorMessage}
          <br/>
          <button type="submit" style={{backgroundColor:"slateblue", color:"white", borderRadius:"12px",width:"100%", height:"50px"}}  className="self-center">Sign In</button>
        </form>
      </div>
    </div>
	)
}

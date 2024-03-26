import {  useState } from "react";

import login_img from "./static/login_img.png";
import eye from "./static/eye.svg";
import eye_slash from "./static/eye-slash.svg"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(<></>)

  const signin = (e:any) => {
    e.preventDefault();
    if (email===""){
      setErrorMessage(<p className="text-red-600">Email is required</p>)
      return;
    }
    if (password===""){
      setErrorMessage(<p className="text-red-600">Password is required</p>);
      return
    }

    fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: email, password:password})
    }).then(res=>{
      res.json().then(obj=>{
        if (obj.status==="error" && obj.error==="Invalid login"){
          setErrorMessage(<p className="text-red-600">Invalid email</p>);
        }

        else if (obj.status==="error"){
          setErrorMessage(<p className="text-yellow-900	">Unable to log in. Please try again later</p>);
          console.log(obj.error);
        }

        else if (obj.status==="ok" && !obj.user){
          setErrorMessage(<p className="text-red-600	">Invalid Password</p>)
        }
        else{
          console.log("LOGGED IN")
          localStorage.setItem("token",obj.user)
        }
      }).catch(err=>{
        console.log(err);
        setErrorMessage(<p className="text-yellow-900	">Unable to log in. Please try again later</p>)
      })
    }).catch(err =>{
      console.log (err);
      setErrorMessage(<p className="text-yellow-900	">Unable to log in. Please try again later</p>)
    })

  }

  return (
    <div className="flex flex-row">
      <div style={{marginTop:"3%",}}>
        <img src={login_img} width={"80%"} style={{float:"right", paddingRight:"5%"}}/>
      </div>
      <div className="m-3" style={{marginTop:"7%", marginLeft:"5%", width:"35%"}}>
        <p className="text-4xl font-bold mb-7 mx-12 bg-violet-800">Welcome Back!</p>
        <form onSubmit={signin}>
          <label htmlFor="email" className="font-light">Email Address</label>
          <br/>
          <input id="email" type="email" style={{height:"50px", width:"100%", borderRadius:"12px", paddingLeft:"3%"}} onChange={(e)=>setEmail(e.target.value)}/>
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
              <input type="checkbox" id="remember"/>
              <label htmlFor="remember">Remember me</label>
            </div>
            <div style={{float: "right"}}>
              <button>Forgot Password</button>
            </div>
          </div>
          <br/>
          {errorMessage}
          <br/>
          <button type="submit"  style={{width:"100%", height:"50px"}}  className="bg-violet-800 text-white rounded-xl self-center">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default Login;
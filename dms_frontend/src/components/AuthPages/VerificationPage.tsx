import { useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function VerificationComponent(){
  const {sendOTP, verifyOTP,} = useGlobalContext();
	const navigate = useNavigate();

  const [message, setMessage] = useState(<></>)
  const [otp, setOtp] = useState(0);
  const [newToken, setNewToken] = useState("");
  const [inputField, setInputField] = useState(0);

  const [heading, setHeading] = useState(
    <div>
      <div className="text-custom-1 font-bold	text-3xl text-center">Verify Your Email</div>
      <div className="text-center">Verify your email in order to access the rest of the site</div>
    </div>
  );
  
  const clickVerify =() =>{
    sendOTP().then((res) => {
      if (res===503)
        setMessage(<p className="text-yellow-600">Server Maintainance. Try Again</p>);
      setHeading(<div className="text-custom-1 font-bold text-3xl text-center">Enter OTP</div>);
      setInputField(1)
    }).catch(err=>{
    console.log(err)
    })
  };
  const clickSubmit = (e:any) => {
    e.preventDefault();
    verifyOTP(otp).then(res => {
      const decoded = decodeToken(res);
      console.log(decoded);
      if (!res || !decoded)
        setMessage(<p className="text-red-600">Try Again</p>)
      else {
        //@ts-ignore
        setNewToken(res);
        setInputField(2)
      }
    })
  };

  /* useEffect(()=>{
    //@ts-ignore
    if (decodeToken(token)["EV"]==1)
      navigate("/")
  }) */

  const clickContinue = () =>{
    localStorage.setItem("Beacon-DMS-token", newToken);
    navigate("/");
  }

  const stages = [
    <div className="text-center">
      <button onClick={()=>clickVerify()} className="text-white bg-green-500 h-12 w-56 font-medium text-xl rounded-xl text-center">Verify</button>
    </div>,
    <form onSubmit={(e)=>clickSubmit(e)}>
      <label htmlFor="otp" className="start-0 text-lg font-medium  ml-5">Enter OTP Below</label>
      <br/>
      <input id="otp" className="border rounded-xl h-10 w-11/12  ml-5" onChange={(e:any)=>setOtp(e.target.value)} type="text" />
      <br/>
      <br/>
      <button type="submit" className="bg-custom-1 text-white h-12 ml-5 w-11/12 rounded-xl">Submit</button>
    </form>,
    <button onClick={clickContinue} className="bg-custom-1 text-white h-12 ml-5 w-11/12 rounded-xl">Continue</button>
    ]

  return (
    <div className="m-auto w-1/2 mt-28 p-5 border border-black rounded-xl bg-white">
      {heading}
      <br/>
      {stages[inputField]}
      <br/>
      {message}
    </div>
  )
}

export default VerificationComponent;
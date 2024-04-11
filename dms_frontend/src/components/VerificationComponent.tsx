import { useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function VerificationComponent(props:any){
  const {sendOTP, verifyOTP,} = useGlobalContext();
  const token = localStorage.getItem("Beacon-DMS-token");
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
    sendOTP(token).then((res) =>{
      console.log(res)
      setHeading(<div className="text-custom-1 font-bold text-3xl text-center">Enter OTP</div>);
      setInputField(1)
    }).catch(err=>{
    console.log(err)
    })
  };
  const clickSubmit = (e:any) => {
    e.preventDefault();
    verifyOTP(token, otp).then(res => {
      const token = res.data.message;
      const decoded = decodeToken(token);
      setNewToken(token);
      if (!decoded)
        setMessage(<p>Try Again</p>)
      else {
        //@ts-ignore
        if (decoded["EV"]==0)
          setMessage(<p>Try Again</p>)
        else{
          setMessage(<p>Success</p>)
          setInputField(2)
        }
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
      <label htmlFor="otp" className="start-0">OTP</label>
      <br/>
      <input id="otp" className="border rounded xl ml-2" onChange={(e:any)=>setOtp(e.target.value)} type="text" />
      <br/>
      <button type="submit">Submit</button>
    </form>,
      <button onClick={clickContinue}>Continue</button>
    ]

  return (
    <div className="m-auto w-1/2 mt-28 p-5 border border-black rounded-xl bg-white">
      {heading}
      <br/>
      {stages[inputField]}
      <br/>
      {message}
      {/* <div className="my-28">TEST HERE
      <div>
        <form onSubmit={()=>clickSubmit()}>
          <label htmlFor="otp" className="start-0">OTP</label>
          <br/>
          <input id="otp" onChange={(e:any)=>setOtp(e.target.value)} type="text" />
          <br/>
          <button type="submit">Submit</button>
        </form>
      </div>
      </div> */}
    </div>
  )
}

export default VerificationComponent;
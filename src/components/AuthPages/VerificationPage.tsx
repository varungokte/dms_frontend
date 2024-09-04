import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP,verifyOTP } from "@/apiFunctions/authAPIs";
import { ToastOptionsAttributes } from "@/types/DataTypes";

import SubmitButton from "../BasicButtons/SubmitButton";
import Button from "@mui/material/Button";
import CountdownTimer from "../BasicComponents/CountdownTimer";
import Toast from "./../BasicComponents/Toast";

function VerificationComponent(props:{setCheck:Function}){
  useEffect(()=>{
		document.title="Verify Email | Beacon DMS"
	},[]);
  
	const navigate = useNavigate();

  const [message, setMessage] = useState(<></>)
  const [otp, setOtp] = useState(0);
  const [stage, setStage] = useState(0);
  const [outOfTime, setOutOfTime] = useState(false);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const retriggerOTPSend = async () => {
    const res = await triggerOTPSend();
    return res===200;
  }
  
  const triggerOTPSend = async () =>{
    try{
      const res = await sendOTP();
      if (res==200){
        setStage(1);
        setToastOptions({open:true, type:"success", action:"sent", section:"OTP"});
      }
      else if (res===503)
        setMessage(<p className="text-yellow-600">Server Maintainance. Try Again</p>);
      else 
        setMessage(<p className="text-yellow-600">Somethinh went wrong.</p>);
      return res;
    }
    catch(e){}
  };
  
  const submitOTP = async () => {
    try{
      setMessage(<></>);
      const res = await verifyOTP(otp);
      console.log("otp submitted response",res);
      if (res.status==412)
        navigate("/");
      else if (res.status==200){
        localStorage.setItem("Beacon-DMS-token", res.data);
        setStage(2);
      }
      else
        setMessage(<p className="text-red-600">Incorrect OTP. Try Again.</p>);
    }
    catch(e){}
  };


	const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}

  return (
    <div>
      <div className=' m-3 absolute inset-y-5 right-0 w-50'>
        <button className="text-blue-700" onClick={logoutUser}>Logout</button>
      </div>
      <div className="m-auto w-1/2 mt-28 p-5 border border-black rounded-xl bg-white">        
        {(()=>{
          switch(stage){
            case 0:{
              return (
                <div>
                  <div>
                    <div className="text-custom-1 font-bold	text-3xl text-center">First-Time Email Verification</div>
                    <div className="text-center">A One Time Password (OTP) will be sent to your email address</div>
                    <br />
                  </div>
                  <div className="text-center">
                    <button onClick={triggerOTPSend} className="text-white bg-green-500 hover:bg-green-700 h-12 w-56 font-medium text-xl rounded-xl text-center">Verify</button>
                  </div>
                </div>
              );
            }
            case 1:{
              return (
                <div>
                  <div className="text-custom-1 font-bold text-3xl text-center">Enter OTP</div>
                  <form>
                    <label htmlFor="otp" className=" text-lg font-medium">An OTP has been sent to your email</label>
                    <br/>
                    <div>
                      <input id="otp" className="border rounded-xl h-12 w-[100%] mt-3 p-3" onChange={e=>setOtp(Number(e.target.value))} type="text" />
                      <br/>
                      <br/>
                      <SubmitButton width="100%" submitButtonText="Submit" submitFunction={submitOTP} disabled={outOfTime} />
                      <br/>
                      <CountdownTimer seconds={300} setOutOfTime={setOutOfTime} enableReset resetThreshold={270} resetText="Resend" resetFunction={retriggerOTPSend} className="mx-2" />
                    </div>
                  </form>
                </div>
              )
            }
            case 2:{
              return (
                <div>
                  <div className="text-green-600 font-bold text-3xl text-center">Email Verified</div>
                  <br />
                  <div className="text-center">
                    <Button variant="contained" color="secondary" onClick={()=>props.setCheck(false)} sx={{borderRadius:"7px"}} size="large">Continue to site</Button>
                  </div>
                </div>
              )
            }
            default:
              return <></>;
          }
          })()}
        <br/>
        {message}
      </div>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default VerificationComponent;
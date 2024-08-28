import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";

function CountdownTimer(props:{className?:string,seconds:number, setOutOfTime:Function, enableReset?:boolean, resetThreshold?:number, resetText?:string, resetFunction?:Function }){
  const startTime = props.seconds;
  const [time, setTime] = useState(startTime);
  const [enableResetButton, setEnableResetButton] = useState(false);
  const [triggerRestart, setTriggerRestart] = useState(false);

  const resetCountdown = () => {
    setTime(props.seconds);
    setEnableResetButton(false);
    if (time==0){
      setTriggerRestart(true);
      props.setOutOfTime(false);
    }
  }

  const timer = () => {
    const counter = setInterval(()=>setTime(curr=>{
      if (curr==0){
        clearInterval(counter);
        return 0;
      }
      else
        return curr-1; 
    }),1000)
  }

  useEffect(()=>{
    if (time==0)
      props.setOutOfTime(true);
    else if (props.resetThreshold && time==props.resetThreshold)
      setEnableResetButton(true);
  },[time]);
  
  useEffect(()=>timer(),[triggerRestart]);

  return (
    <div className={`flex flex-row mt-3 ${props.className}`}>
      <p className={`my-auto mr-3`}>{Math.floor(time/60)}:{(time%60).toString().padStart(2,"0")}</p>
      {props.enableReset
        ?<Button 
          disabled={!enableResetButton} 
          variant="text" 
          color="secondary" 
          startIcon={<RefreshIcon/>}
          onClick={()=>{
            if (props.resetFunction){
              props.resetFunction().then((res:boolean)=>{
                if (res)
                  resetCountdown();
              })
            }
            else
              resetCountdown();
          }}
          >
            {props.resetText}
          </Button>
        :<></>
      }
    </div>
  )
}

export default CountdownTimer;
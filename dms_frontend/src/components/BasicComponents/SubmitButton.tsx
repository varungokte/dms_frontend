import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

function SubmitButton(props:{className?:string, submitFunction:Function, submitButtonText:string, index?:number}){
  const [submitted, setSubmitted] = useState(false);

  const callSubmitFunction = () => {
    setSubmitted(true);
    props.submitFunction(props.index).then(()=>{
      setSubmitted(false);
    })
      
  }

  return(
    <button className={`${props.className} ${submitted?"hover:cursor-progress":"cursor-pointer"}`} type="button" onClick={callSubmitFunction} disabled={submitted} >
      {submitted
        ?<CircularProgress className="mt-1" sx={{color:"white"}} />
        :<span>{props.submitButtonText}</span>
      }
    </button>
  )
}

export default SubmitButton;
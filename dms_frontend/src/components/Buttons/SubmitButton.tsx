import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { Button, Typography } from "@mui/material";

function SubmitButton(props:{className?:string, submitFunction:Function, submitButtonText:string, index?:number}){
  const [submitted, setSubmitted] = useState(false);

  const callSubmitFunction = () => {
    setSubmitted(true);
    props.submitFunction(props.index).then(()=>{
      setSubmitted(false);
    })
  }

  return(
    <Button color="secondary" variant="contained" sx={{borderRadius:"10px", height:"50px", width:"150px", marginX:"10px"}} type="button" onClick={callSubmitFunction} disabled={submitted} className={props.className} >
      {submitted
        ?<CircularProgress className="mt-1" sx={{color:"white"}} />
        :<Typography textTransform="capitalize">{props.submitButtonText}</Typography>
      }
    </Button>
  )
}

export default SubmitButton;
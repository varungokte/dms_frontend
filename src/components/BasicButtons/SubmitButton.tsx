import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { Button, Typography } from "@mui/material";

function SubmitButton(props:{width?:string, submitFunction:Function, submitButtonText:string, index?:number, disabled?:boolean}){
  const [submitted, setSubmitted] = useState(false);
  const defaultWidth = "150px";


  const callSubmitFunction = () => {
    setSubmitted(true);
    props.submitFunction(props.index).then(()=>{
      setSubmitted(false);
    })
  }

  return(
    <Button color="secondary" variant="contained" sx={{borderRadius:"10px", height:"50px", width:props.width||defaultWidth, /* marginX:"10px" */}} type="button" onClick={callSubmitFunction} disabled={submitted|| (props.disabled||false)} >
      {submitted
        ?<CircularProgress className="mt-1" sx={{color:"white"}} />
        :<Typography textTransform="capitalize">{props.submitButtonText}</Typography>
      }
    </Button>
  )
}

export default SubmitButton;
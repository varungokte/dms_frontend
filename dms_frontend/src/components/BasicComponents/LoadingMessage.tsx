import { CircularProgress } from "@mui/material";

function LoadingMessage(props:{sectionName:string}){
  return (
    <div className="m-auto text-center">
      <br />
      <CircularProgress sx={{color:"rgba(80, 65, 188, 1)"}} />
      <div>Fetching {props.sectionName}</div>
    </div>
  )
}

export default LoadingMessage;
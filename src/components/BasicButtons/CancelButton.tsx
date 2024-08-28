import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function CancelButton(props:{onClick:Function}){
  return (
    <Button variant="outlined" color="error" sx={{borderRadius:"10px", height:"50px", width:"150px", marginX:"10px"}} onClick={()=>props.onClick()}>
      <Typography textTransform="capitalize">Cancel</Typography>
    </Button>
  )
}

export default CancelButton;
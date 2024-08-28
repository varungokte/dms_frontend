import Snackbar from '@mui/material/Snackbar';
import { Alert, Typography } from "@mui/material";
import { ToastOptionsAttributes } from "../../types/DataTypes";

function Toast(props:{toastOptions:ToastOptionsAttributes, setToastOptions:Function}){
  const actions = {
    add:"added",
    delete:"deleted",
    edit:"edited",
    save:"saved",
    sent:"sent",
  };

  const handleClose = () => {
    props.setToastOptions((curr:any)=>{
      curr.open=false; 
      return {...curr};
    });
  }
  
  return (
    <Snackbar open={props.toastOptions.open} 
      onClose={handleClose}
      anchorOrigin={{vertical:"bottom", horizontal:"right"}} 
      autoHideDuration={5000}
    >
      <Alert onClose={handleClose} severity={props.toastOptions.type} variant="filled" sx={{ width: '100%' }} >
        <Typography textTransform={"capitalize"}>
          {props.toastOptions.section} {props.toastOptions.type=="error"?"could not be":""} {actions[props.toastOptions.action]}
        </Typography>
      </Alert>
    </Snackbar>
  )
}

export default Toast;
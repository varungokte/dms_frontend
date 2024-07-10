import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import { ToastOptionsAttributes } from "./../../../DataTypes";

function Toast(props:{toastOptions:ToastOptionsAttributes, setToastOptions:Function}){
  const actions = {
    add:"added",
    delete:"deleted",
    edit:"edited",
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
      <Alert onClose={handleClose} 
        severity={props.toastOptions.type} variant="filled" sx={{ width: '100%' }} >
        {props.toastOptions.section} {props.toastOptions.type=="error"?"could not be":""} {actions[props.toastOptions.action]}
      </Alert>
    </Snackbar>
  )
}

export default Toast;
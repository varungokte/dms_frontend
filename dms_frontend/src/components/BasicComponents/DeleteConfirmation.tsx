import { ReactElement, useState } from "react";
import delete_icon from "./../static/delete_icon.svg";
import Dialog from '@mui/material/Dialog';


function DeleteConfirmation(props:{thing:string, deleteFunction:Function, currIndex:number|string, icon?:ReactElement}){
  const [open, setOpen] = useState(false);

  return(
    <div>
      <button onClick={()=>setOpen(true)}>{props.icon ||<img className="m-2" src={delete_icon}/>}</button>
      {open
        ?<Dialog open={open} onClose={()=> setOpen(false)} maxWidth="md" fullWidth >
          <br />
          <div>
            <p className="m-auto text-center text-xl font-bold">Delete {props.thing}</p>
            <p className="m-auto text-center">Are you sure you want to delete this {props.thing} permanently?</p>
          </div>
          <br />
          <div className="m-auto">
            <button className="border-2 py-1 px-5 rounded-lg font-normal hover:bg-slate-100 mx-3">Cancel</button>
            <button className="text-white bg-red-600 py-2 px-5 rounded-lg hover:bg-red-700" onClick={()=>{props.deleteFunction(props.currIndex); setOpen(false)}}>Delete</button>
          </div>
          <br />
        </Dialog>
        :<></>
      }
    </div>
  ) 

  /* return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        {props.icon?props.icon:<img src={delete_icon} width={27}/>}
        </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="m-auto">Delete {props.thing}</AlertDialogTitle>
          <AlertDialogDescription className="m-auto">Are you sure you want to delete this {props.thing} permanently?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-auto">
          <AlertDialogCancel className="border-light rounded-lg font-normal hover:bg-slate-100">Cancel</AlertDialogCancel>
          <button className="text-white bg-red-600 py-2 px-5 rounded-lg hover:bg-red-700" onClick={()=>{props.deleteFunction(props.currIndex); setOpen(false)}}>Delete</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) */
}

export default DeleteConfirmation;
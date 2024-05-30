import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useState } from "react";
import delete_icon from "./../static/delete_icon.svg";

function DeleteConfirmation(props:{triggerText?:any, thing:string, deleteFunction:Function, currIndex:number}){
  const [open, setOpen] = useState(false);

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        {props.triggerText
          ?<span className="inline-block align-middle"><div style={{backgroundColor:"rgba(200, 25, 25, 1)"}} className="mx-3  text-white w-[100px] rounded-[8px] flex flex-row"><img src={delete_icon}/><span className="m-1">Delete</span></div></span>
          :<img src={delete_icon}/>
        }
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="m-auto">Delete {props.thing}{props.triggerText?"s":""}</AlertDialogTitle>
          <AlertDialogDescription className="m-auto">Are you sure you want to delete {props.triggerText?"these":"this"} {props.thing}{props.triggerText?"s":""} permanently?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-auto">
          <AlertDialogCancel className="border-light rounded-lg font-normal hover:bg-slate-100">Cancel</AlertDialogCancel>
          <button className="text-white bg-red-600 py-2 px-5 rounded-lg hover:bg-red-700" onClick={()=>{props.deleteFunction(props.currIndex); setOpen(false)}}>Delete</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmation;
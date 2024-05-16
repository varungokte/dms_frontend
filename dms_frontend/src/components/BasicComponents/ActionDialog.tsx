import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useState } from "react";

function ActionDialog(props:any){
  const [open, setOpen] = useState(false);

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{props.trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white" >
        <AlertDialogHeader>
          <AlertDialogTitle className="m-auto">{props.title}</AlertDialogTitle>
          <AlertDialogDescription className="m-auto">{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-auto">
          <AlertDialogCancel className="border-light rounded-lg font-normal">Cancel</AlertDialogCancel>
          <button className={props.actionClassName} onClick={()=>{props.actionFunction(props.currIndex); setOpen(false)}}>{props.actionLabel}</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ActionDialog;
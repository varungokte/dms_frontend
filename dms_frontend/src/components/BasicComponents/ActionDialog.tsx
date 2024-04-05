import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

function ActionDialog(props:any){
  return(
    <AlertDialog>
      <AlertDialogTrigger>{props.trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white" onSubmit={props.actionFunction}>
        <AlertDialogHeader>
          <AlertDialogTitle className="m-auto">{props.title}</AlertDialogTitle>
          <AlertDialogDescription className="m-auto">{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-auto">
          <AlertDialogCancel className="border-light rounded-lg font-normal">Cancel</AlertDialogCancel>
          <AlertDialogAction className={props.actionClassName} type="submit">{props.actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default ActionDialog;
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


function DealDisplayDialog(props:any){
  return( 
    <Dialog>
      <DialogTrigger className={props.triggerClassName}>{props.triggerText}</DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogDescription>
            {props.data.map((section:any)=>{
              return (
                <div>
                  <h2>{section[0]}</h2>
                </div>
              )
            })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
)

}

export {DealDisplayDialog};

/* 
props:
  triggerText: "Open"
  triggerClassName
  data: [
    //["Section Name", {Section Data}]
    ["Basic Details",{"Agrement ID": "AGMT2024001", "Loan Type": "Short Term"}],
    ["Security Details", {"Share Percentage":"90", "Date of Valuation":"20/20/02"}]
  ]
*/
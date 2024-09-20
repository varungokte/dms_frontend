import DataTable from "../../BasicTables/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "@/static/edit_icon.svg";
import { LoanDocSecProps } from "@/types/ComponentProps";

function LoanConditionView(props:LoanDocSecProps){
  return(
    <DataTable className="border rounded-2xl" 
      columnData={[
        {id:"N", heading:"Condition Name", type:"text"},
        {id:"PL", heading:"Physical Location", type:"text"},
        {id:"EL", heading:"Execution Location", type:"text"},
        {id:"SD", heading:"Start Date", type:"date"},
        {id:"ED", heading:"End Date", type:"date"},
        {id:"P", heading:"Priority", type:"priority"}
      ]}
      tableData={props.data}
      action = {!props.disableEdit?props.data.map((_:any, index:number)=>{
        return(
          <div className="flex flex-row">
            {props.disableEdit
              ?<></>
              :<div>
                <button onClick={()=>props.setFormOpen((curr:boolean[])=>{curr[index]=true;return [...curr]})}><img src={edit_icon} /* className="mr-5" *//></button>
                {props.formOpen[index]
                  ?<FormDialogDocuments key={index} index={index} edit type="condition" 
                    formOpen={props.formOpen[index]} setFormOpen={props.setFormOpen} formTitle={props.label} formSize="md"
                    detailSubmit={props.editFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                    formFields={props.fieldList} currentFields={props.data[index]} currIndex={index} setAdded={props.setAdded}
                  />
                  :<></>
                }
              </div>
            }
            {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteConditionFunction} currIndex={index}/> */}
          </div>
        )
      }):undefined}

    />
  )
}

export default LoanConditionView;
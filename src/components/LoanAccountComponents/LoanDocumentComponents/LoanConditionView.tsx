import { DataTable } from "../../BasicTables/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "@/static/edit_icon.svg";
import { TableDataTypes } from "@/types/DataTypes";
import { LoanDocSecProps } from "@/types/ComponentProps";

function LoanConditionView(props:LoanDocSecProps){
  const tableRows = ["Condition Name", "Phyical Location", "Execution Location", "Start Date","End Date", "Priority"]; 
  const tableDataTypes:TableDataTypes[] = ["text","text","text", "date", "date","priority"]
  
  return(
    <DataTable className="border rounded-2xl" 
      headingRows={props.disableEdit?tableRows:tableRows.concat(["Action"])}
      tableData={props.data}
      columnIDs={["N","PL","EL", "SD", "ED","P"]} dataTypes={props.disableEdit?tableDataTypes:tableDataTypes.concat(["action"])}
      action = {props.data.map((_:any, index:number)=>{
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
      })}

    />
  )
}

export default LoanConditionView;
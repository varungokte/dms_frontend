import { DataTable } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "./../../static/edit_icon.svg";
import { FieldValues, FieldAttributesList, TableDataTypes } from "DataTypes";

function LoanConditionView(props:{conData:FieldValues[], label:string, fieldList:FieldAttributesList, editConditionFunction:Function, deleteConditionFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function, setAdded:Function, disableEdit?:boolean}){
  const tableRows = ["Condition Name", "Phyical Location", "Execution Location", "Start Date","End Date", "Priority"]; 
  const tableDataTypes:TableDataTypes[] = ["text","text","text", "date", "date","priority"]
  
  return(
    <DataTable className="border rounded-2xl" 
      headingRows={props.disableEdit?tableRows:tableRows.concat(["Action"])}
      tableData={props.conData}
      columnIDs={["N","PL","EL", "SD", "ED","P"]} dataTypes={props.disableEdit?tableDataTypes:tableDataTypes.concat(["action"])}
      action = {props.conData.map((_:any, index:number)=>{
        return(
          <div className="flex flex-row">
            {props.disableEdit
              ?<></>
              :<FormDialogDocuments key={index} index={index} edit={true} type="con" 
                triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName={""} titleText={props.label}  
                detailSubmit={props.editConditionFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                formFields={props.fieldList} currentFields={props.conData[index]} currIndex={index} setAdded={props.setAdded}
              />
            }
            {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteConditionFunction} currIndex={index}/> */}
          </div>
        )
      })}

    />
  )
}

export default LoanConditionView;
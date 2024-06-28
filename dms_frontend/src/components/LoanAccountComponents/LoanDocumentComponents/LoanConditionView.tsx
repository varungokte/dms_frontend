import { Table } from "@/components/ui/table";
import { BodyRowsMapping, HeaderRows } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "./../../static/edit_icon.svg";
import { FieldValues, FieldAttributesList } from "DataTypes";

function LoanConditionView(props:{conData:FieldValues[], label:string, fieldList:FieldAttributesList, editConditionFunction:Function, deleteConditionFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function}){
  return(
    <Table className="border rounded-2xl">
      <HeaderRows headingRows={["Condition Name", "Priority", "Phyical Location", "Execution Location", "Start Date","End Date", "Action"]} />
      <BodyRowsMapping
        list={props.conData}
        columns={["N","P","PL","EL", "SD", "ED"]} dataType={["text","priority", "text","text", "date", "date", "action"]}
        action = {props.conData.map((_:any, index:number)=>{
          return(
            <div className="flex flex-row">
              <FormDialogDocuments key={index} index={index} edit={true} type="con" 
                triggerText={<img src={edit_icon} /* className="mr-5" *//>} triggerClassName={""} titleText={props.label}  
                detailSubmit={props.editConditionFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                formFields={props.fieldList} currentFields={props.conData[index]}
              />
              {/* <DeleteConfirmation thing="covenant" deleteFunction={props.deleteConditionFunction} currIndex={index}/> */}
            </div>
          )
        })}
      />
    </Table>
  )
}

export default LoanConditionView;
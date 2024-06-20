import { Table } from "@/components/ui/table";
import { BodyRowsMapping, HeaderRows } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "./../../static/edit_icon.svg";
import { CovenantTypeList } from "./../../../../Constants";
import { FormFieldDetails } from "DataTypes";

function LoanCovenantView(props:{priority:string,covData:any,label:string, fieldList:FormFieldDetails, editCovenantFunction:Function, deleteCovenantFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function}){
  return (
    props.priority==CovenantTypeList[1]
      ?<Table className="border rounded-2xl">
        <HeaderRows headingRows={["Covenant Name","Frequency", "Physical Location", "Execution Location", "Start Date","End Date", "Priority", "Action"]} />
        <BodyRowsMapping
          list={props.covData.filter((document:any)=>document["T"]==CovenantTypeList[1])} columns={["N", "F","PL","EL", "SD", "ED","P"]} dataType={["text", "frequency", "text", "text", "text", "text", "priority", "action"]}
          searchRows={[]} filterRows={[]}
          action = {props.covData.filter((document:any)=>document["T"]==CovenantTypeList[1]).map((item:any, index:number)=>{
            item;
            return(
              <div className="flex flex-row">
                <FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={props.covData[index]}
                />
                <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/>
              </div>
            )
          })}
        />
      </Table>
      :<Table>
        <HeaderRows headingRows={["Covenant Name", "Physical Location", "Execution Location", "Start Date","End Date", "Priority", "Action"]} />
        <BodyRowsMapping list={props.covData.filter((document:any)=>document["T"]==CovenantTypeList[2])} columns={["N","PL","EL", "SD", "ED","P"]} dataType={["text", "text", "text", "date", "date", "priority", "action"]}
          searchRows={[]} filterRows={[]}
          action = {props.covData.filter((document:any)=>document["T"]==CovenantTypeList[2]).map((item:any, index:number)=>{
            item;
            return(
              <div className="flex flex-row">
                <FormDialogDocuments key={index} index={index} edit={true} type="cov"
                  triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName="" titleText={props.label}
                  detailSubmit={props.editCovenantFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={props.covData[index]}
                />
                <DeleteConfirmation thing="covenant" deleteFunction={props.deleteCovenantFunction} currIndex={index}/>
              </div>
            )
          })}
        />
      </Table>
  )
}

export default LoanCovenantView;
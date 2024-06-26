import { Table } from "@/components/ui/table";
import { BodyRowsMapping, HeaderRows } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "./../../static/edit_icon.svg";
import { FieldAttributesList } from "./../../../../DataTypes";

function LoanDocumentView(props:{docData:any, label:string, fieldList:FieldAttributesList, editDocumentFunction:Function, deleteDocumentFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function }){
  return (
    <Table className="border rounded-3xl" style={{borderRadius:"md"}}>
      <HeaderRows 
        headingRows={["Document Name", "Document Category", "Physical Location", "Execution Location", "Priority", "Start Date", "End Date", "Action"]} 
      />
      <BodyRowsMapping list={props.docData} columns={["N", "C", "PL","EL","P", "SD","ED"]} dataType={["text","text","text","text","priority","date","date","action"]}
        searchRows={[]} filterRows={[]}
        action = {props.docData.map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              <FormDialogDocuments key={index} index={index} edit={true} type="doc"
                triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} titleText={props.label} 
                detailSubmit={props.editDocumentFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                formFields={props.fieldList} currentFields={props.docData[index]} currIndex={index}
              />
              <DeleteConfirmation thing="document" deleteFunction={props.deleteDocumentFunction} currIndex={index}/>
            </div>
          )
        })}
      />
    </Table>
  )
}

export default LoanDocumentView;
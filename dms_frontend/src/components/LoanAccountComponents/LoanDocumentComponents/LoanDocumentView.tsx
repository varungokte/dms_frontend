import { DataTable } from "../../BasicComponents/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";

//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "./../../static/edit_icon.svg";
import { FieldAttributesList, TableDataTypes } from "./../../../../DataTypes";

function LoanDocumentView(props:{docData:any, label:string, fieldList:FieldAttributesList, editDocumentFunction:Function, deleteDocumentFunction:Function, addFileFunction:Function, deleteFileFunction:Function, getFileListFunction:Function, setAdded:Function, disableEdit?:boolean }){
  const tableRows = ["Document Name", "Document Category", "Physical Location", "Execution Location", "Start Date", "End Date", "Priority"];
  const tableDataTypes:TableDataTypes[] = ["text","text","text","text","date","date","priority"];
  
  return (
    <DataTable className="border rounded-2xl" 
      headingRows={props.disableEdit?tableRows:tableRows.concat(["Action"])} 
      tableData={props.docData} columnIDs={["N", "C", "PL","EL", "SD","ED","P"]} dataTypes={props.disableEdit?tableDataTypes:tableDataTypes.concat(["action"])}
        searchRows={[]} filterRows={[]}
        action = {props.docData.map((item:any, index:number)=>{
          item;
          return(
            <div className="flex flex-row">
              {props.disableEdit
                ?<></>
                :<FormDialogDocuments key={index} index={index} edit={true} type="doc"
                  triggerText={<img src={edit_icon} width={27} /* className="mr-5" */ />} triggerClassName={""} titleText={props.label} 
                  detailSubmit={props.editDocumentFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                  formFields={props.fieldList} currentFields={props.docData[index]} currIndex={index} setAdded={props.setAdded}
                />
              }
              {/* <DeleteConfirmation thing="document" deleteFunction={props.deleteDocumentFunction} currIndex={index}/> */}
            </div>
          )
        })}
    />
  )
}

export default LoanDocumentView;
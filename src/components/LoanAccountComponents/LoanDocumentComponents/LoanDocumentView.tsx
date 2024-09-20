import DataTable from "../../BasicTables/Table";
import FormDialogDocuments from "../../FormComponents/FormDialogDocuments";
import { LoanDocSecProps } from "@/types/ComponentProps";

//import DeleteConfirmation from "./../../BasicComponents/DeleteConfirmation";
import edit_icon from "@/static/edit_icon.svg";

function LoanDocumentView(props:LoanDocSecProps){
  
  return (
    <DataTable className="border rounded-2xl"  
      tableData={props.data} 
      columnData={[
        {id:"N", heading:"Document Name", type:"text"},
        {id:"C", heading:"Document Category", type:"text"},
        {id:"PL", heading:"Physical Location", type:"text"},
        {id:"EL", heading:"Execution Location", type:"text"},
        {id:"SD", heading:"Start Date", type:"date"},
        {id:"ED", heading:"End Date", type:"date"},
        {id:"P", heading:"Priority", type:"priority"}
      ]}
      action = {!props.disableEdit?props.data.map((_:any, index:number)=>{
        return(
          <div className="flex flex-row">
            {props.disableEdit
              ?<></>
              :<div>
                <button onClick={()=>props.setFormOpen((curr:boolean[])=>{curr[index]=true;return [...curr]})}><img src={edit_icon} width={27} /* className="mr-5" */ /></button>
                {props.formOpen[index]
                  ?<FormDialogDocuments key={index} index={index} edit={true} type="document"
                    formOpen={props.formOpen[index]} setFormOpen={props.setFormOpen} formTitle={props.label}  formSize="md"
                    detailSubmit={props.editFunction} fileSubmit={props.addFileFunction} deleteFile={props.deleteFileFunction} getFiles={props.getFileListFunction}
                    formFields={props.fieldList} currentFields={props.data[index]} currIndex={index} setAdded={props.setAdded}
                  />
                  :<></>
                }
              </div>
            }
            {/* <DeleteConfirmation thing="document" deleteFunction={props.deleteDocumentFunction} currIndex={index}/> */}
          </div>
        )
        }):undefined}
    />
  )
}

export default LoanDocumentView;
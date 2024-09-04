import {  useContext, useEffect, useState } from "react";
import { PermissionContext } from "@/functions/Contexts";
import { DocumentStatusList } from "@/functions/Constants";
import { SetStateBoolean, ToastOptionsAttributes } from "@/types/DataTypes";
import { getModSecName, getPanSecName } from "@/functions/sectionNameAttributes";
import { DocumentSectionDetails } from "@/types/DataTypes";
import { getDocumentsList } from "@/apiFunctions/documentAPIs";

import { DataTable } from "./BasicTables/Table";
import UploadFileButton from "./BasicButtons/UploadFileButton";
import ViewFileButton from "./BasicButtons/ViewFileButton";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { Pagination } from "./BasicComponents/Pagination";
import Toast from "./BasicComponents/Toast";

function SingleDealDocuments(props:{label:string, loanId:string, AID:string, sectionDetails:DocumentSectionDetails, added:boolean, setAdded:SetStateBoolean, admin:boolean, teamRole:string  }){
  const [docData, setDocData] = useState<any>();
  const [isDeleted, setIsDeleted] = useState<number>();
  
  const {userPermissions} = useContext(PermissionContext);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    if (!isDeleted)
      return;

    if (isDeleted==200)
      setToastOptions({open:true, type:"success", action:"delete", section:"File"});
    else
      setToastOptions({open:true, type:"error", action:"delete", section:"File"});

    setIsDeleted(undefined);
  },[isDeleted]);

  useEffect(()=>{
    if ((props.added))
      getDocumentsList({loanId:props.loanId, sectionName:props.sectionDetails.sectionKeyName, currentPage, rowsPerPage, searchString:"",searchType:""}).then(res=>{
        if (res.status==200){
          console.log("document response status",res.obj[0]["data"]);
          setDocData(res.obj[0]["data"]);
          props.setAdded(false);
          setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
        }
        else
          setDocData([]);
      }).catch(()=>{
        setDocData([]);
      })
  },[props.added,currentPage,rowsPerPage]);

  return(
    <div className="p-5 mx-3 my-2 ">
      <br/>
      {docData
        ?docData.length==0
          ?<EmptyPageMessage sectionName="documents" />
          :<DataTable defaultBadges
            headingRows={["Document Name", "Document Category", "Start Date", "End Date", "Physical Location", "Execution Location", "Priority", "Status", "Action"]}
            tableData={docData} 
            columnIDs={["N","C","SD","ED","PL","EL","P","S"]} 
            dataTypes={["text","text","date","date","text","text","priority","doc-status","action"]}
            action={
              docData.map((doc:any,index:number)=>{
                if (doc["S"]==DocumentStatusList[1])
                  return <UploadFileButton key={index} index={index} 
                    disabled={(!props.admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("add")) || (props.admin && !userPermissions[getPanSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("add"))}
                    AID={props.AID} sectionKeyName={props.sectionDetails.sectionKeyName} docId={doc._id} 
                    setAdded={props.setAdded} 
                  />
                else
                  return <ViewFileButton key={index} type="doc" 
                    disabled={(!props.admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("view") || (props.admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("view")))}
                    AID={props.AID} loanId={doc._loanId} docId={doc._id} sectionKeyName={props.sectionDetails.sectionKeyName} 
                    status={doc["S"]} rejectionReason={doc["R"]} 
                    setAdded={props.setAdded} 
                    actualName={(doc.FD && doc.FD[0] && doc.FD[0].originalname)?doc.FD[0].originalname:""} 
                    fileName={(doc.FD && doc.FD[0] && doc.FD[0].filename)?doc.FD[0].filename:""} 
                    setIsDeleted={setIsDeleted}
                  />
              })
            } 
          />
        :<LoadingMessage sectionName="documents" />
      }
      <br />
      {docData && docData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }

      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default SingleDealDocuments;
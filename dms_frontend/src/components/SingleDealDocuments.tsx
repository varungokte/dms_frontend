import {  useContext, useEffect, useState } from "react";
import { PermissionContext } from "@/MenuRouter";
import useGlobalContext from "./../../GlobalContext";
import { DocumentStatusList, sectionNames } from "./../../Constants";
import { DocumentSectionDetails } from "./../../DataTypes";

import { DataTable } from "./BasicComponents/Table";
import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { Pagination } from "./BasicComponents/Pagination";

function SingleDealDocuments(props:{label:string, loanId:string, AID:string, sectionDetails:DocumentSectionDetails, added:boolean, setAdded:Function, open:boolean}){
  const [docData, setDocData] = useState<any>();
  
  const {getDocumentsList} = useGlobalContext();
  const {userPermissions} = useContext(PermissionContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    if (props.added || props.open)
      getDocumentsList({loanId:props.loanId, sectionName:props.sectionDetails.sectionName, currentPage, rowsPerPage}).then(res=>{
        if (res.status==200){
          setDocData(res.obj[0]["data"]);
          props.setAdded(false);
          setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
        }
        else
          setDocData([]);
      }).catch(()=>{
        setDocData([]);
      })
  },[props.added,props.open,currentPage,rowsPerPage]);

  return(
    <div className="p-5 mx-3 my-2 ">
      <br/>
      {docData
        ?docData.length==0
          ?<EmptyPageMessage sectionName="documents" />
          :<DataTable defaultBadges
            headingRows={["Document Name", "Document Category", "Physical Location", "Execution Location", "Priority", "Start Date", "End Date", "Status", "Action"]}
            tableData={docData} 
            columnIDs={["N", "C", "PL","EL","P", "SD","ED","S"]} 
            dataTypes={["text","text","text","text","priority","date","date","doc-status","action"]}
            action={
              docData.map((doc:any,index:number)=>{
                if (doc["S"]==DocumentStatusList[1]){
                  return <UploadFileButton key={index} index={index} disabled={!userPermissions[sectionNames[props.label]]["file"].includes("add")}
                    AID={props.AID} sectionName={props.sectionDetails.sectionName} docId={doc._id} 
                    setAdded={props.setAdded} 
                  />
                }
                else
                  return <ViewFileButton key={index} type="doc" disabled={!userPermissions[sectionNames[props.label]]["file"].includes("view")}
                    AID={props.AID} loanId={doc._loanId} docId={doc._id} sectionName={props.sectionDetails.sectionName} 
                    status={doc["S"]} rejectionReason={doc["R"]} 
                    setAdded={props.setAdded} 
                    actualName={(doc.FD && doc.FD[0] && doc.FD[0].originalname)?doc.FD[0].originalname:""} 
                    fileName={(doc.FD && doc.FD[0] && doc.FD[0].filename)?doc.FD[0].filename:""} 
                  />
              })
            } 
          />
        :<LoadingMessage sectionName="documents" />
      }
      {docData && docData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
    </div>
  )
}

export default SingleDealDocuments;
import {  useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { DocumentStatusList } from "./../../Constants";
import { DocumentSectionDetails } from "./../../DataTypes";

import { DataTable } from "./BasicComponents/Table";
import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";

function SingleDealDocuments(props:{loanId:string, AID:string, sectionDetails:DocumentSectionDetails, added:boolean, setAdded:Function}){
  const [docData, setDocData] = useState<any>();
  const [added, setAdded] = [props.added, props.setAdded]
  
  const {getDocumentsList} = useGlobalContext();

  useEffect(()=>{
    if (added)
      getDocumentsList(props.loanId, props.sectionDetails.sectionName).then(res=>{
        console.log("response",res.obj);
        if (res.status==200){
          setDocData(res.obj);
          setAdded(false);
        }
        else
          setDocData([]);
      }).catch(()=>{
        setDocData([]);
      })
  },[added]);

  return(
    <div className="p-5 mx-3 my-2 ">
      <br/>
      {docData
        ?docData.length==0
          ?<EmptyPageMessage sectionName="documents" />
          :<DataTable 
            headingRows={["Document Name", "Document Category", "Physical Location", "Execution Location", "Priority", "Start Date", "End Date", "Status", "Action"]}
            headingClassNames={[ "w-[15%] text-center","w-[15%] text-center", "w-[10%] text-center", "w-[10%] text-center", "w-[5%] text-center", "w-[10%] text-center","w-[10%] text-center","w-[10%] text-center","text-center"]} 
            tableData={docData} 
            columnIDs={["N", "C", "PL","EL","P", "SD","ED","S"]} 
            dataTypes={["text","text","text","text","priority","date","date","doc-status","action"]}
            cellClassName={["text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center"]}
            action={
              docData.map((doc:any,index:number)=>{
                if (doc["S"]==DocumentStatusList[1])
                  return <UploadFileButton key={index} index={index} 
                  AID={props.AID} sectionName={props.sectionDetails.sectionName} docId={doc._id} 
                  setAdded={setAdded} 
                />
                else
                  return <ViewFileButton key={index} type="doc" 
                  AID={props.AID} loanId={doc._loanId} docId={doc._id} sectionName={props.sectionDetails.sectionName} 
                  status={doc["S"]} rejectionReason={doc["R"]} 
                  setAdded={setAdded} 
                  actualName={(doc.FD && doc.FD[0] && doc.FD[0].originalname)?doc.FD[0].originalname:""} 
                  fileName={(doc.FD && doc.FD[0] && doc.FD[0].filename)?doc.FD[0].filename:""} 
                  />
              })
            } 
          />
        :<LoadingMessage sectionName="documents" />
      }
    </div>
  )
}

export default SingleDealDocuments;
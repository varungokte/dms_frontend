import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { Table } from "@/components/ui/table"
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import TableCollapsible from "./BasicComponents/TableCollapsible";

import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";
import Search from "./BasicComponents/Search";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { DocumentStatus, FormDialogDocumentSections, FormDialogDocumentTypes } from "DataTypes";
import { DocumentStatusList } from "./../../Constants";
import moment from "moment";

type DocumentDetails= {
  _id:string,
  AID:string, 
  CN:string, 
  SD:Date|string,
  details: {S:DocumentStatus}[]
}

type SectionDetails = {
  sectionName: FormDialogDocumentSections,
  sectionType: FormDialogDocumentTypes
}

function DocumentList(props:{label:string}) {	
  const [dealData, setDealData] = useState<DocumentDetails[]>();

  const setSection = (): SectionDetails => {
    if (props.label=="Transaction Documents")
      return { sectionName: "TD", sectionType:"doc" }
    
    else if (props.label=="Compliance Documents")
      return { sectionName: "CD", sectionType:"doc" }
    
    else if (props.label=="Covenants")
      return { sectionName: "C", sectionType:"cov" }
    
    else if (props.label=="Condition Precedent")
      return { sectionName: "CP", sectionType:"con" }
    
    else if (props.label=="Condition Subsequent")
      return { sectionName: "CS", sectionType:"con" }
    else 
      return { sectionName: "undefined", sectionType:"undefined" }
  }

  const [sectionDetails] = useState(setSection());

  const [searchString, setSearchString] = useState("");
  const [added, setAdded] = useState(true);

  const {useTitle, getDealList} = useGlobalContext();

  useTitle(props.label);

  useEffect(()=>{
    if (added)
      getDealList(sectionDetails.sectionName).then((res)=>{
        setDealData(res.obj);
        setAdded(false);
      })
  },[added])

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>
      </div>

      <div className="bg-white m-10 rounded-xl">
        <br/>
        {dealData==undefined
          ?<LoadingMessage sectionName="data" />
          :dealData.length==0
            ?<EmptyPageMessage sectionName="deals"/>
            :dealData.map((deal:DocumentDetails, index:number)=>{
              return <SingleDealDetails key={index} deal={deal} sectionDetails={sectionDetails} searchString={searchString} setAdded={setAdded} />
            })
        }
        <br/>
      </div>
    </div>
  )
}

function SingleDealDetails(props:{deal:DocumentDetails, sectionDetails:SectionDetails, searchString:string, setAdded:Function}) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(()=>{
    const totalDocs = props.deal.details.length;
    let verifiedDocs = 0;
    for (let i=0; i<totalDocs; i++){
      if (props.deal.details[i]["S"]=="Verified")
        verifiedDocs++;
    }
    const percentage = verifiedDocs/totalDocs*100
    const rounded_percentage = Math.round(percentage*100)/100
    setProgressValue(rounded_percentage);
  },[props.deal])

  return(
    <TableCollapsible
      topRow={[
        [props.deal.AID, "w-[20%] font-medium text-base"],
        [props.deal.CN, "w-[20%] font-medium text-base"], 
        [moment(props.deal.SD).format("DD-MM-yyyy"), "w-[30%] font-medium text-base"],
        ["Document Upload", "w-[26.70%] font-medium text-base text-justify"],
      ]}
      bottomRow={[
        ["Agreement ID", "font-light"], 
        ["Company Name", "font-light"],
        ["Sanction Date", "font-light"],
        [<ProgressBar value={progressValue} />, "content-center"],
      ]}
      content={<SingleDealDocuments loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} setAdded={props.setAdded} />}
      searchString={props.searchString}
    />
  )
}

function SingleDealDocuments(props:{loanId:string, AID:string, sectionDetails:SectionDetails, setAdded:Function}){
  const [docData, setDocData] = useState<any>();
  
  const {getDocumentsList} = useGlobalContext();
  
  //const [priority, setPriority] = useState(3);

  useEffect(()=>{
    getDocumentsList(props.loanId, props.sectionDetails.sectionName).then(res=>{
      console.log("document list",res);
      if (res.status==200)
        setDocData(res.obj);
      else
        setDocData([]);
    }).catch(()=>{
      setDocData([]);
    })
  },[]);

  return(
    <div className="p-5 mx-3 my-2 ">
      <br/>
      {docData
        ?docData.length==0
          ?<EmptyPageMessage sectionName="documents" />
          :<Table>
            <HeaderRows 
              headingRows={["Document Name", "Document Category", "Physical Location", "Execution Location", "Priority", "Start Date", "End Date", "Status", "Action"]}
              headingClassNames={[ "w-[15%] text-center","w-[15%] text-center", "w-[10%] text-center", "w-[10%] text-center", "w-[5%] text-center", "w-[10%] text-center","w-[10%] text-center","w-[10%] text-center","text-center"]} 
            />
            <BodyRowsMapping list={docData} 
              columns={["N", "C", "PL","EL","P", "SD","ED","S"]} 
              dataType={["text","text","text","text","priority","date","date","docStatus","action"]}
              cellClassName={["text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center"]}
              searchRows={[]} filterRows={[]}
              action={
                docData.map((doc: any)=>{
                  if (doc["S"]==DocumentStatusList[1])
                    return <UploadFileButton />
                  else
                    return <ViewFileButton AID={props.AID} loanId={doc._loanId} docId={doc._id} status={doc["S"]} sectionName={props.sectionDetails.sectionName} rejectionReason={doc["R"]} actualName={doc.FD[0].originalname||""} fileName={doc.FD[0].filename||""} setAdded={props.setAdded} />
                })
              }
            />
          </Table>
        :<LoadingMessage sectionName="documents" />
      }
    </div>
  )
}

export default DocumentList;
import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { Table } from "@/components/ui/table"
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import TableCollapsible from "./BasicComponents/TableCollapsible";

import {UploadButton, ViewFilesButton} from "./BasicComponents/UploadButton";
import Search from "./BasicComponents/Search";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { FormDialogDocumentSections, FormDialogDocumentTypes } from "DataTypes";

type DocumentDetails= {
  _id:string,
  AID:string, 
  CN:string, 
  SD:Date|string,
  details: {S:number}[]
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
        console.log("response",res)
        setDealData(res.obj);
        setAdded(false);
      })
  },[added,sectionDetails])

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
              return <SingleDealDetails key={index} deal={deal} sectionDetails={sectionDetails} searchString={searchString} />
            })
        }
        <br/>
      </div>
    </div>
  )
}

function SingleDealDetails(props:{deal:DocumentDetails, sectionDetails:SectionDetails, searchString:string}) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(()=>{
    const totalDocs = props.deal.details.length;
    let verifiedDocs = 0;
    for (let i=0; i<totalDocs; i++){
      if (props.deal.details[i]["S"]==3)
        verifiedDocs++;
    }
    setProgressValue(verifiedDocs/totalDocs*100);
  },[props.deal])

  return(
    <TableCollapsible
      topRow={[
        [props.deal.AID, "w-[20%] font-medium text-base"],
        [props.deal.CN, "w-[20%] font-medium text-base"], 
        [props.deal.SD, "w-[30%] font-medium text-base"],
        ["Document Upload", "w-[26.70%] font-medium text-base text-justify"],
      ]}
      bottomRow={[
        ["Agreement ID", "font-light"], 
        ["Company Name", "font-light"],
        ["Sanction Date", "font-light"],
        [<ProgressBar value={progressValue} />, "content-center"],
      ]}
      content={/* props.sectionDetails.sectionType=="doc"
        ? */<SingleDealDocuments loanId={props.deal["_id"]} sectionDetails={props.sectionDetails}  />
        /* :(props.sectionDetails.sectionType=="cov"
          ?<SingleDealDocuments loanId={props.deal["_id"]} />
          :<SingleDealDocuments loanId={props.deal["_id"]} />
        ) */
      }
      searchString={props.searchString}
    />
  )
}

function SingleDealDocuments(props:{loanId:string, sectionDetails:SectionDetails}){
  const [docData, setDocData] = useState<any>([]);
  
  const {getDocumentsList} = useGlobalContext();
  
  //const [priority, setPriority] = useState(3);

  useEffect(()=>{
    getDocumentsList(props.loanId, props.sectionDetails.sectionName).then(res=>{
      console.log("document list",res)
      setDocData(res.obj)
    })
  },[]);

  return(
    <div className="p-5 mx-3 my-2 ">
      {/* <div className="float-right">
        <div className="text-base">
          Priority:{`  `}
          <select className="p-3 rounded-xl"
            value={priority} 
            onChange={(e:any)=>setPriority(e.target.value)}
          >
            {EnumIteratorKeys(PriorityValues).map((val,index)=>{
              return <option key={index} value={val}>{PriorityValues[Number(val)]}</option>
            })}
          </select>
        </div>
        <br/> 
      </div> 
      <br/>  */}
      <br/>
      {docData.length==0
        ?<EmptyPageMessage sectionName="documents" />
        :<Table>
          <HeaderRows 
            headingRows={["Document Name", "Document Category", "Physical Location", "Execution Location", "Priority", "Start Date", "End Date", "Status", "Action"]}
            headingClassNames={[ "w-[15%] text-center","w-[15%] text-center", "w-[10%] text-center", "w-[10%] text-center", "w-[5%] text-center", "w-[10%] text-center","w-[10%] text-center","w-[10%] text-center","text-center"]} 
          />
          <BodyRowsMapping list={docData} 
            columns={["N", "C", "PL","EL","P", "SD","ED","S"]} 
            dataType={["text","transaction","text","text","priority","date","date","docStatus","action"]}
            cellClassName={["text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center"]}
            searchRows={[]} filterRows={[]}
            action={
              docData.map((doc: any)=>{
                if (doc["S"]==1)
                  return <UploadButton />
                else
                  return <ViewFilesButton />
              })
            }
          />
        </Table>
      }
    </div>
  )
}

/* function SingleDealCovenants(props:{loanId:string}){

  return (
    <div>Cov</div>
  )
}

function SingleDealConditions(props:{loanId:string}){
  useEffect(()=>{
  },[]);
  
  return (
    <div></div>
  )
}
 */
export default DocumentList;
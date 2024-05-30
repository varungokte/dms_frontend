import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { Table } from "@/components/ui/table"
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import TableCollapsible from "./BasicComponents/TableCollapsible";

import {UploadButton, ViewFilesButton} from "./BasicComponents/UploadButton";
import Search from "./BasicComponents/Search";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

function DocumentList(props:{label:string}) {	
  
  const [dealData] = useState([
    {AID:"ABC123", CN:"Company 1", SD:"01/01/01", },
    {AID:"AGMT123", CN:"Company 2", SD:"01/01/01", },
  ]);
  const [searchString, setSearchString] = useState("");

  const {useTitle} = useGlobalContext();

  useTitle(props.label);

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
        {dealData.length==0
          ?<EmptyPageMessage sectionName="deals"/>
          :<>
            {dealData.map((deal:Object, index:number)=>{
              return (<SingleDealDetails key={index} deal={deal} label={props.label} searchString={searchString} />)
            })}
          </> 
        }
        <br/>
      </div>
    </div>
  )
}

function SingleDealDetails(props:{deal:any, label:string, searchString:string}) {
  return(
    <TableCollapsible
      topRow={[
        [props.deal["AID"], "w-[20%] font-medium text-base"],
        [props.deal["CN"], "w-[20%] font-medium text-base"], 
        [props.deal["SD"], "w-[30%] font-medium text-base"],
        ["Document Upload", "w-[26.70%] font-medium text-base text-justify"],
      ]}
      bottomRow={[
        ["Agreement ID", "font-light"], 
        ["Company Name", "font-light"],
        ["Sanction Date", "font-light"],
        [<ProgressBar value={50} />, "content-center"],
      ]}
      content={props.label=="Transaction Documents" || props.label=="Compliance Documents"
        ?<SingleDealDocuments AID={props.deal["AID"]}  />
        :(props.label=="Covenants"
          ?<SingleDealCovenants AID={props.deal["AID"]} />
          :<SingleDealConditions AID={props.deal["AID"]} />
        )
      }
      searchString={props.searchString}
    />
  )
}

function SingleDealDocuments(props:{AID:string}){
  //const [priority, setPriority] = useState(3);
  const [docData, setDocData] = useState<any>([]);

  useEffect(()=>{
    props.AID
    setDocData([
      {N: 3, P:1, PL:"Mumbai", EL:"Mumbai", SD:"02/02/02", ED:"03/03/03", S:1 },
      {N: 1, P:3, PL:"Jaipur", EL:"Jaipur", SD:"02/02/02", ED:"03/03/03", S:2 },
      {N: 5, P:2, PL:"Coruscant", EL:"Coruscant", SD:"02/02/02", ED:"03/03/03", S:2 },
      {N: 2, P:2, PL:"Tipoca City", EL:"Coruscant", SD:"02/02/02", ED:"03/03/03", S:1 },
    ]);
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
          <HeaderRows headingRows={[["Document Name", "w-[20%] text-center"], ["Priority","w-[10%] text-center"], ["Physical Location", "w-[15%] text-center"], ["Execution Location", "w-[15%] text-center"], ["Start Date", "w-[15%] text-center"],["End Date", "w-[15%] text-center"], ["Status","w-[20%] text-center"], ["Action","text-center"]]} />
          <BodyRowsMapping list={docData} 
            dataType={["transaction","priority","text","text","text","text","docStatus","action"]} 
            columns={["N","P","PL","EL","SD","ED","S"]}
            cellClassName={["text-center","","text-center","text-center","text-center","text-center","text-center",""]}
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

function SingleDealCovenants(props:{AID:string}){
  useEffect(()=>{
    props.AID
  },[]);

  return (
    <div>Cov</div>
  )
}

function SingleDealConditions(props:{AID:string}){
  useEffect(()=>{
    props.AID
  },[]);
  
  return (
    <div></div>
  )
}

export default DocumentList;
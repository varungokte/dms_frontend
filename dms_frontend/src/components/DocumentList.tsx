import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";

import { PriorityValues, PriorityStyling, EnumIteratorKeys } from "./BasicComponents/Constants";
import UploadButton from "./BasicComponents/UploadButton";
import Search from "./BasicComponents/Search";

import chevron_right from "./static/chevron-right.svg";
import chevron_down from "./static/chevron-down.svg";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";

function DocumentList(props:any) {
  //This can be for Transaction Documents, Compliance Documents, Covenants, and others
  //Data about documents: An array where each element represents the details of a single transaction
  //Each transaction is an array: [Sanction_No, Deal_Name, Date, Document_List]
  //Document_List is an array of documents detais
  //Each document details is an array: [Doc_Name, Doc_type, Priority, Deal_Date, Status, completed, total, [the actual document files]]
  const [docData] = useState(props.docData)
  const [searchString, setSearchString] = useState("");

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
        <Table>
          <TableBody>
            {docData.map((deal:any)=>{
              return (<DealDetails deal={deal}/>)
            })}
          </TableBody>
        </Table>
        <br/>
      </div>
    </div>
  )
}

function DealDetails(props:any) {
  const [chevronToggle, setChevronToggle] = useState(false);

  return(
    <div>
      <Collapsible>
        <div className="bg-zinc-100 m-3 rounded-2xl">
          <CollapsibleTrigger className="w-full" 
            onClick={()=>setChevronToggle((curr)=>{return !curr})}>
            <TableRow className="border-none">
              <TableCell className="w-[20%] font-medium text-base">{props.deal[0]}</TableCell>
              <TableCell className="w-[20%] font-medium text-base">{props.deal[1]}</TableCell>
              <TableCell className="w-[30%] font-medium text-base">{props.deal[2]}</TableCell>
              <TableCell className="w-[26.70%] font-medium text-base text-justify">Document Upload</TableCell>
              <TableCell className="w-[10%]" rowSpan={2}><img src={chevronToggle?chevron_down:chevron_right} width={"20px"}/></TableCell>
            </TableRow>

            <TableRow className="border-none">
              <TableCell className="font-light">Sanction No.</TableCell>
              <TableCell className="font-light">Deal Name</TableCell>
              <TableCell className="font-light">Date</TableCell>
              <TableCell className="content-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5" style={{width: "70%"}}>
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width:"50%"}}></div>
                  50%
                </div>
              </TableCell>
            </TableRow>
          </CollapsibleTrigger>
        </div>
          <CollapsibleContent>
            <SingleDealDocuments documents={props.deal[3]}/>
            <br/>
          </CollapsibleContent>
      </Collapsible>
    </div>
  )  
}

function SingleDealDocuments(props:any){
  const [priority, setPriority] = useState(2);

  return(
    <div className="p-5 mx-3 my-2 ">
      <div className="float-right">
        <div className="text-base">
          Priority:{`  `}             
          <select className="p-3 rounded-xl" onChange={(e:any)=>setPriority(e.target.value)}>
            {EnumIteratorKeys(PriorityValues).map(val=>{
              if (Number(val)==priority)
                return <option value={val} selected>{PriorityValues[Number(val)]}</option>
              else
                return <option value={val}>{PriorityValues[Number(val)]}</option>
            })}
          </select>
        </div>
      <br/> 
      </div> 
      <br/> 
      <br/>
      <Table className="bg-gray-100 rounded-xl">
        <HeaderRows headingRows={[["Document Name", "w-[20%]"], ["Document Type", "w-[10%]"],["Priority","w-[15%] text-center"],["Deal Date", "w-[20%]"],["Status","w-[20%]"], ["Action"]]} />
        <BodyRowsMapping 
          list={props.douments} dataType={["text","text","text","priority","text","text","action"]}
          searchRows={[]} filterRows={[priority,2]} 
        />
        <TableBody >
          {props.documents.map((doc:any) => {
            if (doc[2]==priority)
            return(
              <TableRow>
                <TableCell>{doc[0]}</TableCell>
                <TableCell>{doc[1]}</TableCell>
                <TableCell >
                  <div className={`${PriorityStyling[Number(doc[2])]} rounded-lg text-center`}>{PriorityValues[Number(doc[2])]}</div>
                </TableCell>
                <TableCell>{doc[3]}</TableCell>
                <TableCell>{doc[4]}/{doc[5]}</TableCell>
                <TableCell>{doc[6].length===0?<UploadButton fileType={doc[1]+""}/>:""}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default DocumentList;
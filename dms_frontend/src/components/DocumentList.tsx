import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";

import { PriorityValues, PriorityStyling } from "./BasicComponents/Priority";

import chevron_right from "./static/chevron-right.svg";
import chevron_down from "./static/chevron-down.svg";
import upload_icon from "./static/upload_icon.svg";
import Search from "./BasicComponents/Search";

function UploadButton(type:string) {
  return(
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row border-2 border-dashed rounded-xl py-2 w-28" style={{backgroundColor: "rgba(225, 237, 255, 1)", borderColor: "rgba(148, 192, 255, 1)"}}>
              <img className="m-auto" src={upload_icon}/>
              <span className="m-auto" style={{color: "rgba(71, 145, 249, 1)"}}>Upload</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white">
            <p>Upload Document as {type}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
};

function DealDetails(props:any) {
  const [chevronToggle, setChevronToggle] = useState(Array(props.docData.length).fill(false));
  const [priority, setPriority] = useState(Array(props.docData.length).fill(2));

  return(
    <div>
      <Collapsible>
        <div className="bg-zinc-100 m-3 rounded-2xl">
          <CollapsibleTrigger className="w-full" 
            onClick={()=>{
              const arr = [...chevronToggle];
              arr[props.ind]=!chevronToggle[props.ind];
              setChevronToggle(arr);
            }}>
            <TableRow className="border-none">
              <TableCell className="w-[20%] font-medium text-base">{props.txn[0]}</TableCell>
              <TableCell className="w-[20%] font-medium text-base">{props.txn[1]}</TableCell>
              <TableCell className="w-[30%] font-medium text-base">{props.txn[2]}</TableCell>
              <TableCell className="w-[26.70%] font-medium text-base text-justify">Document Upload</TableCell>
              <TableCell className="w-[10%]" rowSpan={2}><img src={chevronToggle[props.ind]?chevron_down:chevron_right} width={"20px"}/></TableCell>
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
            <div className="p-5 mx-3 my-2 ">
              <div className="flex flex-row flex-auto">
              </div>
              <div className="float-right">
                <div className="text-base">Priority:{` `}             
                  <select className="p-3 rounded-xl" 
                    onChange={(e:any)=>{
                    const arr = [...priority];
                    arr[props.ind]=e.target.value;
                    setPriority(arr);
                  }}>
                    {Object.keys(PriorityValues).filter(v=>!isNaN(Number(v))).map(val=>{
                      if (Number(val)===priority[props.ind])
                      {
                        return <option value={val} selected>{PriorityValues[Number(val)]}</option>
                      }else
                      return <option value={val}>{PriorityValues[Number(val)]}</option>
                    })}
                  </select>
                </div>
              <br/> 
              </div> 
              <br/> 
              <br/>
              <Table className="bg-gray-100 rounded-xl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Document Name</TableHead>
                    <TableHead className="w-[10%]">Document Type</TableHead>
                    <TableHead className="w-[15%] text-center">Priority</TableHead>
                    <TableHead className="w-[20%]">Deal Date</TableHead>
                    <TableHead className="w-[20%]">Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {//@ts-ignore
                  props.txn[3].map(doc => {
                    if (doc[2]==priority[props.ind])
                    return(
                      <TableRow>
                        <TableCell>{doc[0]}</TableCell>
                        <TableCell>{doc[1]}</TableCell>
                        <TableCell >
                          <div className={`${PriorityStyling[Number(doc[2])]} rounded-lg text-center`}>{PriorityValues[Number(doc[2])]}</div>
                        </TableCell>
                        <TableCell>{doc[3]}</TableCell>
                        <TableCell>{doc[4]}/{doc[5]}</TableCell>
                        <TableCell>{doc[6]}</TableCell>
                      </TableRow>
                    )
                  })}
                  
                </TableBody>
              </Table>
            </div>
            <br/>
          </CollapsibleContent>
      </Collapsible>
    </div>
  )  
}

function DocumentList(props:any) {
  //This can be for Transaction Documents, Compliance Documents, Covenants, and others
  //Data about documents: An array where each element represents the details of a single transaction
  //Each transaction is an array: [Sanction_No, Deal_Name, Date, Document_List]
  //Document_List is an array of documents detais
  //Each document details is an array: [Doc_Name, Doc_type, Priority, Deal_Date, completed, total, [the actual document files]]
  const [docData, setDocData] = useState(props.docData)
  const [searchString, setSearchString] = useState("");

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>

        <div>{UploadButton("PDF")}</div>
      </div>

      <div className="bg-white m-10 rounded-xl">
      <br/>
      <Table>
        <TableBody>
          {docData.map((txn:any,ind:number)=>{
            return (<DealDetails docData={docData} txn={txn} ind={ind}/>)
          })}
        </TableBody>
      </Table>
        <br/>
      </div>
    </div>
  )
}

export default DocumentList;
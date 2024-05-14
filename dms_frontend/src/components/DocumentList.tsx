import { useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { Table, TableBody } from "@/components/ui/table"
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { PriorityValues, EnumIteratorKeys } from "./BasicComponents/Constants";
import TableCollapsible from "./BasicComponents/TableCollapsible";

import UploadButton from "./BasicComponents/UploadButton";
//import Search from "./BasicComponents/Search";
import ProgressBar from "./BasicComponents/ProgressBar";

function DocumentList(props:any) {
  //This can be for Transaction Documents, Compliance Documents, Covenants, and others
  //Data about documents: An array where each element represents the details of a single transaction
  //Each transaction is an array: [Sanction_No, Deal_Name, Date, Document_List]
  //Document_List is an array of documents detais
  //Each document details is an array: [Doc_Name, Doc_type, Priority, Deal_Date, Status, completed, total, [the actual document files]]
  const [docData] = useState(props.docData)
  //const [searchString, setSearchString] = useState("");

  const {useTitle} =useGlobalContext();

  useTitle(props.label)

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row">
        {/* <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>   */}
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

  return(
    <TableCollapsible
      topRow={[
        [props.deal[1], "w-[20%] font-medium text-base"],
        [props.deal[0], "w-[20%] font-medium text-base"], 
        [props.deal[2], "w-[30%] font-medium text-base"],
        ["Document Upload", "w-[26.70%] font-medium text-base text-justify"],
      ]}
      bottomRow={[
        ["Sanction No.", "font-light"], 
        ["Deal Name", "font-light"],
        ["Date", "font-light"],
        [<ProgressBar value={50} />, "content-center"],
      ]}
      content={<SingleDealDocuments documents={props.deal[3]}/>}
    />
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
          list={props.documents} dataType={["text","text","priority","text","text","action"]}
          searchRows={[]} filterRows={[priority,2]}
          action={
            props.documents.map((doc: any)=>{
              return doc[6].length===0?<UploadButton fileType={doc[1]+""}/>:<></>
            })
          }
        />
      </Table>
    </div>
  )
}

export default DocumentList;
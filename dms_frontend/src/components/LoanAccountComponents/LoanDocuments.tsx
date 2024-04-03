import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

import { PriorityValues, PriorityStyling } from "../BasicComponents/Priority";
import { StatusValues, StatusStyling } from "../BasicComponents/Status";


function LoanDocuments(props: any) {
  //SHOULD GET DOCDATA FROM props.docData

  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData] = useState([
    ["Common Loan Agreement", 2, "Jaipur", "Jaipur", "15/08/17", "15/08/17", 0],
    ["Lender Agent Agreement", 2, "Pune", "Pune",  "15/08/17", "15/08/17", 2],
    ["Power Purchase Agreement", 0, "Surat", "Surat", "15/08/17", "15/08/17", 1],
    ["Lender Agent Agreement", 1, "Surat", "Surat",  "15/08/17", "15/08/17", 2],
    ["Escrow Agreement", 1, "Pune", "Pune",  "15/08/17", "15/08/17", 2],
  ]);
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);

  return (
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold m-7 mt-5">{props.label}</p>


      <div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 p-3 rounded-xl my-2 w-72" 
          onChange={(e)=>{
            const val = e.target.value+"";
            setSearchString(val.replace("\\", "/\\/"))
          }} 
          placeholder="Search"/>
        </div>

        <div className="flex-auto">
          <select className="bg-white border-2 p-3 rounded-xl mt-2 w-60" onChange={(e:any)=>setPriority(e.target.value)}>
            <option value={-1}>Priority</option>
            {Object.keys(PriorityValues).filter(v=>isNaN(Number(v))).map((val,ind)=>{
              return(
                <option value={ind}>{val}</option>
              )
            })}
          </select>
        </div>
      
        <div className="mr-3">
          <button className="p-3 w-36 bg-custom-1 text-white mt-2 rounded-xl">Add</button>
        </div>        
      </div>
      <div className="m-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Document Name</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Physical Location</TableHead>
              <TableHead className="text-center">Execution Location</TableHead>
              <TableHead className="text-center">Start Date</TableHead>
              <TableHead className="text-center">End Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docData.map(document => {
              const regEx = new RegExp(searchString, "i");
              if ((priority==-1 || priority==document[1]) && (searchString=="" || (document[0]+"").search(regEx)!==-1))
              return (
                <TableRow className="text-center">
                  <TableCell>{document[0]}</TableCell>
                  <TableCell ><div className={`${PriorityStyling[Number(document[1])]} rounded-lg text-center`}>{PriorityValues[Number(document[1])]}</div></TableCell>
                  <TableCell className="text-center">{document[2]}</TableCell>
                  <TableCell>{document[3]}</TableCell>
                  <TableCell>{document[4]}</TableCell>
                  <TableCell>{document[5]}</TableCell>
                  <TableCell className={`${StatusStyling[Number(document[6])]}`}>{StatusValues[Number(document[6])]}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <br/>
    </div>
  )
}

export default LoanDocuments;
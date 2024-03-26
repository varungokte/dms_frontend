import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";

function DocumentList(props:any) {
  //This can be for Transaction Documents, Compliance Documents, Covenants, and others
  //Data about documents: An array where each element represents the details of a single transaction
  //Each transaction is an array: [Sanction_No, Deal_Name, Date, Document_List]
  //Document_List is an array of documents detais
  //Each document details is an array: [Doc_Name, Doc_type, Priority, Deal_Date, completed, total, [the actual document files]]
  const [docData, setDocData] = useState(props.docData)

  const [searchString, setSearchString] = useState("");

  const [priority, setPriority] = useState(2);

  enum PriorityValues {
    "Low",
    "Medium",
    "High"
  };

  enum PriorityStyling {
    "text-green-600 bg-green-100",
    "text-yellow-600 bg-yellow-50",
    "text-red-600 bg-red-100",
  };

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 p-5 rounded-xl my-2" onChange={(e)=>setSearchString(e.target.value)} placeholder="Search"/>
        </div>
      </div>

      <div className="bg-white m-10">
      <br/>
      <Table>
        <TableBody>
          {docData.map((txn:any)=>{
            return(
              <div>
              <Collapsible>
                <div className="bg-zinc-100 m-3 rounded-2xl">
                    <TableRow className="border-none">
                      <TableCell className="w-[30%] font-medium">{txn[0]}</TableCell>
                      <TableCell className="w-[30%] font-medium">{txn[1]}</TableCell>
                      <TableCell className="w-[15%] font-medium">{txn[2]}</TableCell>
                      <TableCell className="w-[20%] font-medium">Document Upload</TableCell>
                      <TableCell rowSpan={2}>
                        <CollapsibleTrigger>Right Arrow</CollapsibleTrigger>
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-none">
                      <TableCell className="font-light">Sanction No.</TableCell>
                      <TableCell className="font-light">Deal Name</TableCell>
                      <TableCell className="font-light">Date</TableCell>
                      <TableCell><div className="w-full bg-gray-200 rounded-full h-2.5" style={{width: "70%"}}><div className="bg-green-600 h-2.5 rounded-full" style={{width:"50%"}}></div>50%</div></TableCell>
                    </TableRow>
                    
                </div>
                    <CollapsibleContent>
                      <div className="p-5 mx-1 my-2 bg-white rounded-xl">
                        <div className="flex flex-row">
                          <div className="float-right">
                            <div>Priority:{` `}             
                              <select onChange={(e:any)=>setPriority(e.target.value)}>
                                <option value={2}>High</option>
                                <option value={1}>Medium</option>
                                <option value={0}>Low</option>
                              </select>
                            </div>
                            
                          </div>
                        </div> 
                        <Table>
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
                            txn[3].map(doc => {
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
          })}
        </TableBody>
      </Table>
        <br/>

      </div>
    </div>
  )
}

export default DocumentList;
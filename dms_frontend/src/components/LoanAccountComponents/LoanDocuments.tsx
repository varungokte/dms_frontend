import { useState } from "react";
import { Table } from "@/components/ui/table";

import { PriorityValues, EnumIteratorValues, EnumIteratorKeys } from "../BasicComponents/Constants";
import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";

function LoanDocuments(props: any) {
  //SHOULD GET DOCDATA FROM props.docData

  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData] = useState([
    ["Common Loan Agreement", 2, "Jaipur", "Jaipur", "15/08/17", "15/08/17"],
    ["Lender Agent Agreement", 2, "Pune", "Pune",  "15/08/17", "15/08/17"],
    ["Power Purchase Agreement", 0, "Surat", "Surat", "15/08/17", "15/08/17"],
    ["Lender Agent Agreement", 1, "Surat", "Surat",  "15/08/17", "15/08/17"],
    ["Escrow Agreement", 1, "Pune", "Pune",  "15/08/17", "15/08/17"],
  ]);
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);

  return (
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold m-7 mt-5">{props.label}</p>

      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" />
        </div>

        <div className="flex-auto">
          <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(PriorityValues)} valueList={EnumIteratorKeys(PriorityValues)}
            setPlaceholder={true} placeholderValue={[-1,"Priority"]} 
          />
        </div>
      
        <div className="mr-3">
          <button className="p-3 w-36 bg-custom-1 text-white mt-2 rounded-xl">Add</button>
        </div>        
      </div>
      <div className="m-5">
        <Table>
          <HeaderRows headingRows={[["Document Name"],["Priority"], ["Physical Location"],["Execution Location"], ["Start Date"],["End Date"],]} />

          <BodyRowsMapping list={docData} dataType={["text","priority","text","text","text","text"]}
            searchRows={searchString==""?[]:[searchString,0]} filterRows={priority==-1?[]:[priority,1]}
          />
        </Table>
      </div>
      <br/>
    </div>
  )
}

export default LoanDocuments;
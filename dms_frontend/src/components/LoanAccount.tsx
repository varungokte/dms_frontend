import { useState } from "react";
import { Link } from "react-router-dom";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import Search from "./BasicComponents/Search";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";

function LoanAccount() {
  const [accountList, setAccountList] = useState([
    ["AGMT2023001", "Company1", "Group1", "South","90000", "90000"],
    ["AGMT2023002", "Company2", "Group2", "East","80000", "80000"],
    ["AGMT2023003", "Company3", "Group3", "South","30000", "30000"], 
  ]);

  const [searchString, setSearchString] = useState("");

  return(
    <div className="bg-white rounded-xl m-5">
			<p className="text-2xl font-bold m-3">Loan Account</p>
      
      <div className="flex flex-row">
        <div className="flex-auto"> <Search label="Search" setter={setSearchString}/> </div>
        <div> <Link className={`${PurpleButtonStyling} mt-3 p-5`} to="create">Add a Loan Account</Link> </div>
      </div>

      <div className="m-5 border rounded-xl">
        <Table className="">
          <HeaderRows headingRows={[["Sr. No.", "w-[100px]"], ["Agreement ID"], ["Client Name"], ["Group Name"], ["Zone"], ["Sanction Amount"], ["O/S Amount"]]} />
          <BodyRowsMapping 
            list={accountList.map((acc:any,ind)=>{return[ind+1].concat(acc)})} 
            dataType={["text","text","text","text","text","text","text"]} 
            cellClassName={["font-medium", "text-custom-1","","","","",""]} 
            searchRows={[]} filterRows={[]}
          />
        </Table>
        <br/>
      </div>
    </div>
  )
}

export default LoanAccount;
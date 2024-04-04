import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import Search from "./BasicComponents/Search";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";

function LoanAccount() {
  const [accountList, setAccountList] = useState([
    ["AGMT2023001", "Company1", "Group1", "South","90000", "90000"],
    ["AGMT2023002", "Company2", "Group2", "East","80000", "80000"],
    ["AGMT2023003", "Company3", "Group3", "South","30000", "30000"], 
  ]);

  const [searchString, setSearchString] = useState("");

  return(
    <div className="bg-white rounded-xl">
			<p className="text-2xl font-bold m-3">Loan Account</p>
      <div className="flex flex-row">
        <div className="flex-auto">
          <Search label="Search" setter={setSearchString}/>
        </div>
        <div>   
          <button className={PurpleButtonStyling}>Add a Loan Account</button>
        </div>
      </div>
      <div className="m-5 border rounded-xl">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr. No.</TableHead>
            <TableHead>Agreement ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Group Name</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Sanction Amount</TableHead>
            <TableHead>O/S Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountList.map((account,index)=>{
            return(
              <TableRow>
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell className="text-custom-1">{account[0]}</TableCell>
                <TableCell>{account[1]}</TableCell>
                <TableCell>{account[2]}</TableCell>
                <TableCell>{account[3]}</TableCell>
                <TableCell>{account[4]}</TableCell>
                <TableCell>{account[5]}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

export default LoanAccount;
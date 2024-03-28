import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

function LoanAccount() {
  const [accountList, setAccountList] = useState([
  ])

  return(
    <div className="bg-white rounded-xl">
			<p className="text-2xl font-bold m-7 mt-5">Loan Account</p>
      <div className="flex flex-row m-7">
        <div className='flex-auto'>
          Data range
        </div>
        <div> 
          <button>Add a Loan Account</button>
        </div>
      </div>
      <div className="m-5">
      <Table>
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
                <TableCell>{account[0]}</TableCell>
                <TableCell>{account[0]}</TableCell>
                <TableCell>{account[0]}</TableCell>
                <TableCell>{account[0]}</TableCell>
                <TableCell>{account[0]}</TableCell>
                <TableCell>{account[0]}</TableCell>
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
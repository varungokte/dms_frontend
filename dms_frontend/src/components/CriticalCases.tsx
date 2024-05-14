import { useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Ellipsis } from "lucide-react";

import Search from "./BasicComponents/Search";
import useGlobalContext from "./../../GlobalContext";

function CriticalCases() {
  //An array of critical cases
  //Each critical case is an array where: [Document Name, Document Type, Date, Priority(will always be HIGH)]
  const [defaultData] = useState([
    ["Lender's Agent Agreeement", "PDF", "01/01/01"],
    ["Lender's Agent Agreeement", "PNG", "02/02/02"],
    ["Power Purchase Agreement", "PDF", "03/03/03"]
  ]);

  const {useTitle} = useGlobalContext();

  useTitle("Critical Cases")

  const [searchString, setSearchString] = useState("");
  return(
    <div>
			<p className="text-3xl font-bold m-7">Critical Cases</p>

      <div className='flex flex-row relative'>
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>

        <div>
          Date Range
        </div>
      </div>
      <div className="m-7">
      <Table className="rounded-xl bg-white">
        <TableHeader className="">
          <TableRow>
            <TableHead className="w-[100px]">Sr. No.</TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultData.map((val,ind)=>{
            const regEx = new RegExp(searchString, "i");
            if (searchString=="" || (val[0]+"").search(regEx)!==-1)
            return(
              <TableRow key={ind}>
                <TableCell className="font-medium">{ind+1}</TableCell>
                <TableCell>{val[0]}</TableCell>
                <TableCell>{val[1]}</TableCell>
                <TableCell>{val[2]}</TableCell>
                <TableCell><div className="text-red-600 bg-red-100 rounded-lg text-center">High</div></TableCell>
                <TableCell><Ellipsis/></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

export default CriticalCases;
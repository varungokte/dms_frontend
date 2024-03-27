import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"


function Covenants() {
  const [covenantList] = useState([
    ["Financial Covenant", "Debt Service Coverage Ratio", "Quaterly", "15/08/17", "15/08/17"],
    ["Negative Covenant", "Debt Service Coverage Ratio", "Annually", "15/08/17", "15/08/17"],
    ["Financial Covenant", "Loan to Value Ratio", "Quaterly", "15/08/17", "15/08/17"],
  ])


  const [searchString, setSearchString] = useState("")
  return (
    <div className="bg-white rounded-xl">
      <br/>
      <p className="text-2xl font-bold m-7 mt-5">Covenants</p>

      <div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 p-3 rounded-xl my-2 w-72" 
          onChange={(e)=>{
            const val = e.target.value+"";
            setSearchString(val.replace("\\", "/\\/"))
          }} 
          placeholder="Search"/>
        </div>
      </div>
      
      <div className="m-7">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Covenant Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {covenantList.map(covenant=>{
              return(
                <TableRow>
                  <TableCell>{covenant[0]}</TableCell>
                  <TableCell>{covenant[1]}</TableCell>
                  <TableCell>{covenant[2]}</TableCell>
                  <TableCell>{covenant[3]}</TableCell>
                  <TableCell>{covenant[4]}</TableCell>
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

export default Covenants;
/* import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Ellipsis } from "lucide-react";

import Search from "./BasicComponents/Search";
import useGlobalContext from "./../../GlobalContext";
import { FieldValues } from "DataTypes";

function CriticalCases(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [defaultData] = useState([
    ["Lender's Agent Agreeement", "PDF", "01/01/01"],
    ["Lender's Agent Agreeement", "PNG", "02/02/02"],
    ["Power Purchase Agreement", "PDF", "03/03/03"]
  ]);

  const {getCriticallist} = useGlobalContext();

  const [searchString, setSearchString] = useState("");
  const [added, setAdded] = useState(true);

  useEffect(()=>{
    if (added){
      getCriticallist().then(res=>{
        if (res.status==200)
          console.log(res.obj)
      })
    }
  },[added]);


  const sectionNameBeautify:{[key:string]:string} = {
    "transactions": "Transaction Documents",
    "compliance": "Compliance Documents",
    "covenants": "Covenants",
    "precedents": "Condition Precedent",
    "subsequents": "Condition Subsequent",
  }

  const sectionNameToAbbreviation:{[key:string]:string} = {
    "transactions": "TD",
    "compliance": "CD",
    "covenants": "C",
    "precedents": "Condition Precedent",
    "subsequents":"Condition Subsequent",
  }

  const getDocsLoanData = (docList:FieldValues[],loanDetails:FieldValues[],teamName:string,section:string,arr:FieldValues[],links:string[]) => {
    for (let j=0; j<docList.length; j++){
      const singleDoc = docList[j];
      const loanId = singleDoc["_loanId"];
      const obj:any ={};
      obj["_id"] = singleDoc["_id"]
      obj["_loanId"] = loanId;
      obj["TN"] = teamName;
      obj["S"] = singleDoc["S"];
      if (singleDoc["R"])
        obj["R"] = singleDoc["R"];

      obj["SN"] = sectionNameToAbbreviation[section];

      if (singleDoc["FD"])
        obj["FD"] = [...singleDoc["FD"]];

      obj["DD"] = singleDoc["ED"];
      obj["C"] = singleDoc["C"];
      

      obj["link"] = <div>
        <p className="text-blue-500 text-base">{sectionNameBeautify[section]}</p>
        <p className="font-light">{obj["C"]}</p>
      </div>;

      for (let k=0; k<loanDetails.length; k++){
        if (loanId == loanDetails[k]["_id"]){
          obj["AID"]=loanDetails[k]["AID"];
          obj["CN"] = loanDetails[k]["CN"];
        }     
      }
      arr.push(obj);
      if (section=="payment")
        links.push("../schedule")
      else if (section=="covenants")
        links.push("../"+section);
      else if (section.charAt(section.length-1)=="s")
        links.push("../"+section.slice(0,section.length-1));
      else
        links.push("../"+section);
    }
  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>

      <div className='flex flex-row relative'>
        <Search setter={setSearchString} label="Search" className="mx-7"/>
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

export default CriticalCases; */
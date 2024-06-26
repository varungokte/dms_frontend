import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table"
import { Ellipsis } from "lucide-react";
import Search from "./BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
//import useGlobalContext from "../../GlobalContext";


function Default(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [defaultData] = useState([
    {AID:"001",N:"Mortgage", T:"Payment", D:"01/01/01"},
    {AID:"002",N:"Home Loan", T:"Covenant", D:"02/02/02"},
    {AID:"003",N:"Business Loan", T:"Bankrupcy", D:"03/03/03"},
  ]);

  const [searchString, setSearchString] = useState("");
  
  return(
    <div>
			<p className="text-3xl font-bold m-7">Default Cases</p>

      <div className='flex flex-row relative'>
        <div className=''>
          <Search setter={setSearchString} label="Search"/>
        </div>
      </div>

      <div className="m-7">
        <Table className="rounded-xl bg-white">
          <HeaderRows headingRows={["Sr. No.","Deal","Default Type","Date"]} />
          <BodyRowsMapping list={defaultData} dataType={["index","text","text","text"]} columns={["AID","N","T", "D"]}
            searchRows={searchString==""?[]:[searchString,0]} filterRows={[]} 
            action={[<Ellipsis/>]} cellClassName={["font-medium","","","",""]}
          />
        </Table>

      </div>
    </div>
  )
}
 
export default Default;
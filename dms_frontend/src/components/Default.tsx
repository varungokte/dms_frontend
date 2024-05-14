import { useState } from "react";
import { Table } from "@/components/ui/table"
import { Ellipsis } from "lucide-react";
import Search from "./BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import useGlobalContext from "./../../GlobalContext";


function Default() {
  //An array of default cases
  //Each default case is an array where: [Deal Name, Default Type, Date]
  const [defaultData] = useState([
    ["Mortgage", "Payment", "01/01/01"],
    ["Home Loan", "Covenant", "02/02/02"],
    ["Business Loan", "Bankrupcy", "03/03/03"]
  ]);

  const [searchString, setSearchString] = useState("");

	const {useTitle} = useGlobalContext();

	useTitle("Default Cases");

  return(
    <div>
			<p className="text-3xl font-bold m-7">Default Cases</p>

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
        <HeaderRows headingRows={[["Sr. No.","w-[100px]"],["Deal"],["Default Type"],["Date"],["Action"]]} />
        <BodyRowsMapping list={defaultData} dataType={["index","text","text","text","action"]}
          searchRows={searchString==""?[]:[searchString,0]} filterRows={[]} 
          action={<Ellipsis/>} cellClassName={["font-medium","","","",""]}
        />
      </Table>

      </div>
    </div>
  )
}

export default Default;
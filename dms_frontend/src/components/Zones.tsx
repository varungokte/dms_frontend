import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { FieldValues } from "./../../DataTypes";
import { ZoneList } from "./../../Constants";

import Filter from "./BasicComponents/Filter";
import { Table } from "./ui/table";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

function Zones(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	const [loanList, setLoanList] = useState<FieldValues[]>();
	const [zones, setZones] = useState<string[]>([]);

	const {getLoanList} = useGlobalContext();

	useEffect(()=>{
		setLoanList(undefined);
		getLoanList("Z",zones.length==0?"":zones).then(res=>{
			console.log("response",res)
			if (res.status==200)
				setLoanList(res.arr);
			else
				setLoanList([])
		})
	},[zones]);
	
	return(
		<div className="m-5">
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row mx-7">
				<div className="flex-auto"><Filter value={zones} setValue={setZones} options={ZoneList} placeholderValue="Zones" multiple /> </div>
			</div>

			<div className="bg-white mx-7 my-5">
				{loanList
					?loanList.length==0
						?<EmptyPageMessage sectionName="loans" />
						:<Table>
							<HeaderRows headingRows={["Sr. No.", "Agreement ID", "Company Name", "Group Name", "Zone", "Sanction Amount"]} headingClassNames={["w-[100px]","text-center","text-center","text-center","text-center","text-center"]} />
							<BodyRowsMapping list={loanList} columns={["AID", "CN", "GN", "Z", "SA"]}  dataType={["index","text","text","text","text","text"]}  cellClassName={["font-medium text-center", "text-center text-custom-1","text-center","text-center","text-center","text-center"]} />
						</Table>
					:<LoadingMessage sectionName="data" />
				}
				<br />
			</div>
		</div>
	)
}

export default Zones;
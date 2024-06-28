import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { FieldValues } from "./../../DataTypes";
import { LoanProductList, ZoneList } from "./../../Constants";
import { Link } from "react-router-dom";

import { Table } from "./ui/table";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import Filter from "./BasicComponents/Filter";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

import edit_icon from "./static/edit_icon.svg";


function FilterPage(props:{label:string}){
  const filterTypes:{[key:string]:{label:"Z"|"P",options:string[]}} = {
    "Zones":{
      label:"Z",
      options:ZoneList
    },
    "Products":{
      label:"P",
      options:LoanProductList
    }
  };

  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [filterCategory] = useState(filterTypes[props.label]);
	const [loanList, setLoanList] = useState<FieldValues[]>();
	const [filtersList, setFiltersList] = useState<string[]>([]);

	const { getLoanList} = useGlobalContext();

	useEffect(()=>{
		setLoanList(undefined);
		getLoanList(filterCategory.label,filtersList.length==0?[]:filtersList).then(res=>{
      console.log("Response",res)
			if (res.status==200)
				setLoanList(res.arr);
			else
				setLoanList([])
		})
	},[filtersList]);
	
	return(
		<div className="m-5">
			<p className="text-3xl font-bold my-7">{props.label}</p>
			<div className="flex flex-row ">
				<div className="flex-auto">
          <Filter value={filtersList} setValue={setFiltersList} options={filterCategory.options} placeholderValue={props.label} multiple /> 
        </div>
			</div>

			<div>
				{loanList
					?loanList.length==0
						?<span><br/><EmptyPageMessage sectionName="loans"/></span>
						:<Table className="bg-white my-5">
							<HeaderRows headingRows={["Sr. No.", "Agreement ID", "Company Name", "Group Name", "Zone", "Sanction Amount","Action"]} 
                headingClassNames={["w-[80px]","w-[20%] text-center"," w-[20%] text-center","text-center","text-center","text-center","text-center"]}
              />
							<BodyRowsMapping list={loanList} columns={["AID", "CN", "GN", "Z", "SA"]} 
                dataType={["index","text","text","text","text","text","action"]} 
                cellClassName={["font-medium text-center", "text-center text-custom-1","text-center","text-center","text-center","text-center"]} 
                action = {loanList.map((item:any)=>{
                  return(
                    <div className="flex flex-row">
                      <Link className="m-2" to="../loan/create" state={{linkSource: "EDIT", loanId: item["_id"], AID: item.AID}}><img src={edit_icon}/></Link>
                    </div>
                  )
                })}
              />
						</Table>
					:<LoadingMessage sectionName="data" />
				}
				<br />
			</div>
		</div>
	)
}

export default FilterPage
import { useContext, useEffect, useState } from "react";
import { FieldValues, TableDataTypes, ToastOptionsAttributes } from "@/types/DataTypes";
import { LoanProductList, ZoneList } from "../functions/Constants";
import { Link } from "react-router-dom";

import { DataTable } from "./BasicTables/Table";
import Filter from "./BasicComponents/Filter";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import delete_icon from "@/static/delete_icon.svg";

import edit_icon from "@/static/edit_icon.svg";
import view_icon from "@/static/view_icon.svg";
import Toast from "./BasicComponents/Toast";
import { PermissionContext } from "@/functions/Contexts";
import { Pagination } from "./BasicComponents/Pagination";
import SearchByType from "./BasicComponents/SearchByType";
import { deleteLoan, getLoansList } from "@/apiFunctions/loanAPIs";

function FilterPage(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
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

  const {userPermissions} = useContext(PermissionContext);

  const [filterCategory] = useState(filterTypes[props.label]);
	const [loanList, setLoanList] = useState<FieldValues[]>();
	const [filtersList, setFiltersList] = useState<string[]>([]);

  const editPermission = userPermissions["loan"].includes("edit");
  const viewPermission = userPermissions["loan"].includes("view");
  const deletePermission = userPermissions["loan"].includes("delete");

  const tableHeadings =["Sr. No.", "Agreement ID", "Company Name", "Zone", "Sanction Amount", "Loan Status"];
  const tableDataTypes:TableDataTypes[] = ["index","text","text","text","text","loan-status"];

  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const [openDelete, setOpenDelete] = useState([false]);
  const searchOptions = [{label:"Agreement ID", value:"AID"}, {label:"Company Name", value:"CN"}];

	useEffect(()=>{
		setLoanList(undefined);
		getLoansList({filterType:filterCategory.label,filterCategory:filtersList.length==0?[]:filtersList, currentPage,rowsPerPage, searchString, searchType}).then(res=>{
      //console.log("Response",res)
			if (res.status==200){
        if (res.arr && res.arr[0] && res.arr[0]["data"]){
          setLoanList(res.arr[0]["data"]);
          setOpenDelete(new Array(res.arr[0]["data"].length).fill(false));
        }
        if (res.arr && res.arr[0] && res.arr[0]["metadata"] && res.arr[0]["metadata"][0] && res.arr[0]["metadata"][0])
        setTotalPages(Math.ceil(Number(res.arr[0]["metadata"][0]["total"])/Number(rowsPerPage)));
      }
			else
				setLoanList([])
		})
	},[filtersList,currentPage,rowsPerPage, searchString]);

	const deleteLoanAccount = async (currIndex:number) => {
    if (!loanList)
      return;
    const loanId = loanList[currIndex]["_id"];
    const res = await deleteLoan(loanId);

    if (res==200){
      setToastOptions({open:true,type:"success", action:"delete",section:"Loan account"});
    }
    else
      setToastOptions({open:true,type:"error", action:"delete",section:"Loan account"});
  }
	
	return(
		<div className="">
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row ">
				<div className="m-auto">
          <SearchByType className="mx-7" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
        </div>
        <div className="m-auto flex-auto">
          <Filter value={filtersList} setValue={setFiltersList} options={filterCategory.options} placeholderValue={props.label} multiple /> 
        </div>
			</div>
			<br />
			<div className="mx-7">
				{loanList
					?loanList.length==0
						?<span><br/><EmptyPageMessage sectionName="loans"/></span>
						:<DataTable className="bg-white"
              headingRows={editPermission||viewPermission||deletePermission?tableHeadings.concat("Action"):tableHeadings}
							tableData={loanList} columnIDs={["AID", "CN", "Z", "SA","S"]}
              dataTypes={editPermission||viewPermission||deletePermission?tableDataTypes.concat("action"):tableDataTypes} 
              indexStartsAt={(currentPage-1)*rowsPerPage}
							action = {loanList.map((item,index)=>{
								return(
                  <div className="flex flex-row">
                    {userPermissions["loan"].includes("edit")
                      ?<Link className="m-2" to="../loan/create" state={{linkSource: "EDIT", loanId: item["_id"], AID: item.AID}}><img src={edit_icon}/></Link>
                      :userPermissions["loan"].includes("view")
                        ?<Link className="m-2" to="../loan/create" state={{linkSource: "VIEW", loanId: item["_id"], AID: item.AID}}><img src={view_icon}/></Link>
                        :<></>
                    }
                    
                    {userPermissions["loan"].includes("delete")
                      ?<div>
                        <button onClick={()=>setOpenDelete(curr=>{curr[index]=true; return [...curr]})}><img className="m-2" src={delete_icon}/></button>
                        {openDelete[index]?<DeleteConfirmation thing="loan account" deleteFunction={deleteLoanAccount} open={openDelete[index]} setOpen={setOpenDelete} currIndex={index}/>:<></>}
                        </div> 
                      :<></>
                    }
                  </div>
								)
							})}
						/>
					:<LoadingMessage sectionName="data" />
				}
				<br />
			</div>
      {loanList && loanList.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
		</div>
	)
}

export default FilterPage;
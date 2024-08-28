import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalContext from "@/functions/GlobalContext";

import { DataTable } from "./BasicTables/Table";
import view_icon from "@/static/view_icon.svg";
import edit_icon from "@/static/edit_icon.svg";
import delete_icon from "@/static/delete_icon.svg";

import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import { FieldValues, TableDataTypes, ToastOptionsAttributes } from "@/types/DataTypes";
import Toast from "./BasicComponents/Toast";
import { sectionNames } from "@/functions/Constants";
import { Pagination } from "./BasicComponents/Pagination";
import { PermissionContext } from "@/MenuRouter";
import SearchByType from "./BasicComponents/SearchByType";
import AddButton from "./BasicButtons/AddButton";

function LoanAccount(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [accountList, setAccountList] = useState<FieldValues[]>();

  const {getLoanList, deleteLoan} = useGlobalContext();
  const {userPermissions} = useContext(PermissionContext);

  const [added,setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const editPermission = userPermissions[sectionNames[props.label]].includes("edit");
  const viewPermission = userPermissions[sectionNames[props.label]].includes("view");
  const deletePermission = userPermissions[sectionNames[props.label]].includes("delete");

  const tableHeadings =["Sr. No.", "Agreement ID", "Company Name", "Zone", "Sanction Amount", "Loan Status"];
  const tableDataTypes:TableDataTypes[] = ["index","text","text","text","text","loan-status"];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const [openDelete, setOpenDelete] = useState([false]);
  const searchOptions = [{label:"Agreement ID", value:"AID"}, {label:"Company Name", value:"CN"}];

  const getData = async () => {
    if (!added)
      return;
    const res = await getLoanList({currentPage, rowsPerPage, searchString, searchType});
    if (res.status==200){
      if (res.arr && res.arr[0] && res.arr[0]["data"]){
        setAccountList(res.arr[0]["data"]);
        setOpenDelete(new Array(res.arr[0]["data"].length).fill(false));
      }
      if (res.arr && res.arr[0] && res.arr[0]["metadata"] && res.arr[0]["metadata"][0] && res.arr[0]["metadata"][0])
        setTotalPages(Math.ceil(Number(res.arr[0]["metadata"][0]["total"])/Number(rowsPerPage)));
    }
    else
      setAccountList([]);
    setAdded(false);
  };

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage,searchString,searchType]);

  useEffect(()=>{
    getData();
  },[added]);

  const deleteLoanAccount = async (currIndex:number) => {
    if (!accountList)
      return;
    const loanId = accountList[currIndex]["_id"];
    const res = await deleteLoan(loanId);

    if (res==200){
      setAdded(true);
      setToastOptions({open:true,type:"success", action:"delete",section:"Loan account"});
    }
    else
      setToastOptions({open:true,type:"error", action:"delete",section:"Loan account"});
  }

  if (!userPermissions)
    return <></>;
  
  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="flex flex-row">
        <div className="m-auto flex-auto">
          <SearchByType 
            className="mx-7"
            searchString={searchString} setSearchString={setSearchString} 
            searchType={searchType} setSearchType={setSearchType} 
            typeOptions={searchOptions} 
          />
        </div>
        {userPermissions[sectionNames[props.label]].includes("add")
          ?<div className="">
            <Link to="create" state={{linkSource: "CREATE"}}>
              <AddButton sectionName="loan account" onClick={()=>{}} />
            </Link>
          </div>
          :<></>
        }
      </div>
      <div className="m-7">
        {accountList
          ?accountList.length==0
            ?<EmptyPageMessage sectionName="loan accounts"/>
            :<DataTable className="bg-white rounded-xl"
              headingRows={editPermission||viewPermission||deletePermission?tableHeadings.concat("Action"):tableHeadings} headingClassNames={["w-[100px]"]}
              tableData={accountList} columnIDs={["AID", "CN", "Z", "SA","S"]} dataTypes={editPermission||viewPermission||deletePermission?tableDataTypes.concat("action"):tableDataTypes} 
              cellClassName={["font-medium", "text-custom-1","","","","",""]}
              indexStartsAt={(currentPage-1)*rowsPerPage}
              action = {accountList.map((item,index)=>{
                return(
                  <div className="flex flex-row">
                    {userPermissions[sectionNames[props.label]].includes("edit")
                      ?<Link className="m-2" to="create" state={{linkSource: "EDIT", loanId: item["_id"], AID: item.AID}}><img src={edit_icon}/></Link>
                      :userPermissions[sectionNames[props.label]].includes("view")
                        ?<Link className="m-2" to="create" state={{linkSource: "VIEW", loanId: item["_id"], AID: item.AID}}><img src={view_icon}/></Link>
                        :<></>
                    }
                    
                    {userPermissions[sectionNames[props.label]].includes("delete")
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
          : <LoadingMessage sectionName="loan accounts"/>
        }
      </div>
      {accountList && accountList.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      <br/>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
      
    </div>
  )
}

export default LoanAccount;
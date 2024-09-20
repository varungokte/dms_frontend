import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getModSecName } from "@/functions/sectionNameAttributes";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { PermissionContext } from "@/Contexts";
import { deleteLoan, getLoansList } from "@/apiFunctions/loanAPIs";

import DataTable from "./BasicTables/Table";
import AddButton from "./BasicButtons/AddButton";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import Toast from "./BasicComponents/Toast";
import { Pagination } from "./BasicComponents/Pagination";
import SearchByType from "./BasicComponents/SearchByType";

import view_icon from "@/static/view_icon.svg";
import edit_icon from "@/static/edit_icon.svg";
import delete_icon from "@/static/delete_icon.svg";

function LoanAccount(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [accountList, setAccountList] = useState<FieldValues[]>();
  
  const {userPermissions} = useContext(PermissionContext);

  const [added,setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  
  const editPermission = userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("edit");
  const viewPermission = userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("view");
  const deletePermission = userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("delete");
  
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
    const res = await getLoansList({currentPage, rowsPerPage, searchString, searchType});
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
        {userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("add")
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
              tableData={accountList} 
              columnData={[
                {id:"AID", heading:"Agreement ID", type:"text", cellClassName:"text-custom-1"},
                {id:"CN", heading:"Company Name", type:"text"},
                {id:"Z", heading:"Zone", type:"text"},
                {id:"SA", heading:"Sanctioned Amount", type:"text"},
                {id:"S", heading:"Loan Status", type:"loan-status"}
              ]}
              showIndex={{
                startsAt:(currentPage-1)*rowsPerPage, 
                heading:"Sr. No.",
                cellClassName:"font-medium"
              }}
              action = {editPermission||viewPermission||deletePermission?accountList.map((item,index)=>{
                return(
                  <div className="flex flex-row">
                    {userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("edit")
                      ?<Link className="m-2" to="create" state={{linkSource: "EDIT", loanId: item["_id"], AID: item.AID}}><img src={edit_icon}/></Link>
                      :userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("view")
                        ?<Link className="m-2" to="create" state={{linkSource: "VIEW", loanId: item["_id"], AID: item.AID}}><img src={view_icon}/></Link>
                        :<></>
                    }
                    
                    {userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("delete")
                      ?<div>
                        <button onClick={()=>setOpenDelete(curr=>{curr[index]=true; return [...curr]})}><img className="m-2" src={delete_icon}/></button>
                        {openDelete[index]?<DeleteConfirmation thing="loan account" deleteFunction={deleteLoanAccount} open={openDelete[index]} setOpen={setOpenDelete} currIndex={index}/>:<></>}
                        </div> 
                      :<></>
                    }
                  </div>
                )
              }):undefined}
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
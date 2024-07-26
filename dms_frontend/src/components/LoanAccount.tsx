import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalContext from "./../../GlobalContext";

import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { DataTable } from "./BasicComponents/Table";
import edit_icon from "./static/edit_icon.svg";
import view_icon from "./static/view_icon.svg";

import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import { FieldValues, TableDataTypes, ToastOptionsAttributes } from "DataTypes";
import Toast from "./BasicComponents/Toast";
import { sectionNames } from "./../../Constants";
import { Pagination } from "./BasicComponents/Pagination";
import { PermissionContext } from "@/MenuRouter";

function LoanAccount(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [accountList, setAccountList] = useState<FieldValues[]>();

  const {getLoanList, deleteLoan} = useGlobalContext();
  const {userPermissions} = useContext(PermissionContext);

  const [added,setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  const [tableHeadings, setTableHeadings] = useState(["Sr. No.", "Agreement ID", "Company Name", "Zone", "Sanction Amount", "Loan Status"]);
  const [tableDataTypes, setTableDataTypes] = useState<TableDataTypes[]>(["index","text","text","text","text","loan-status"]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getData = async () => {
    if (!added)
      return;
    const res = await getLoanList({currentPage:currentPage, rowsPerPage:rowsPerPage})
    if (res.status==200){
      setAccountList(res.arr[0]["data"]);
      setTotalPages(Math.ceil(Number(res.arr[0]["metadata"][0]["total"])/Number(rowsPerPage)));
    }
    else
      setAccountList([]);
    setAdded(false);
  };

  useEffect(()=>{
    getData();
  },[added]);

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

  useEffect(()=>{
    const editPermission = userPermissions[sectionNames[props.label]].includes("edit");
    const viewPermission = userPermissions[sectionNames[props.label]].includes("view");
    const deletePermission = userPermissions[sectionNames[props.label]].includes("delete");

    if (editPermission || viewPermission || deletePermission){
      setTableHeadings(curr=>{
        if (curr [curr.length-1]!="Action")
          curr.push("Action");
        return [...curr];
      });
      setTableDataTypes(curr=>{
        if (curr [curr.length-1]!="action")
          curr.push("action");
        return [...curr];
      });
    }
  },[userPermissions]);

  //const [searchString, setSearchString] = useState("");

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
    <div className="bg-white rounded-xl m-5">
      <br/>
			<p className="text-3xl font-bold mx-5 mb-5">Loan Account</p>
      <hr/>
      <br/>
      <div className="flex flex-row">
        <div className="m-auto flex-auto"> {/* <Search label="Search by Agreement ID" setter={setSearchString}/> */}</div>
        {userPermissions[sectionNames[props.label]].includes("add")
          ?<div className="m-auto"><Link className={`${CreateButtonStyling} p-4`} to="create" state={{linkSource: "CREATE"}}>Add a Loan Account</Link></div>
          :<></>
        }
      </div>
      <div className="m-5">
        {accountList
          ?accountList.length==0
            ?<EmptyPageMessage sectionName="loan accounts"/>
            :<DataTable 
              headingRows={tableHeadings} headingClassNames={["w-[100px]"]}
              tableData={accountList} columnIDs={["AID", "CN", "Z", "SA","S"]} dataTypes={tableDataTypes} 
              cellClassName={["font-medium", "text-custom-1","","","","",""]} searchRows={[]} filterRows={[]}
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
                      ?<DeleteConfirmation thing="loan account" deleteFunction={deleteLoanAccount} currIndex={index}/>
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
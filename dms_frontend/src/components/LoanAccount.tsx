import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalContext from "./../../GlobalContext";

//import Search from "./BasicComponents/Search";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { DataTable } from "./BasicComponents/Table";
import edit_icon from "./static/edit_icon.svg";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import { FieldValues, ToastOptionsAttributes } from "DataTypes";
import Toast from "./BasicComponents/Toast";

function LoanAccount(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [accountList, setAccountList] = useState<FieldValues[]>();

  const {getLoanList, deleteLoan} = useGlobalContext();

  const [added,setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  useEffect(()=>{
    if (added){
      getLoanList().then(res=>{
        if (res.status==200)
          setAccountList(res.arr);
        else
          setAccountList([]);
      }).catch(()=>{
        setAccountList([]);
      });
      setAdded(false);
    }
  },[added]);

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
  
  return(
    <div className="bg-white rounded-xl m-5">
      <br/>
			<p className="text-3xl font-bold mx-5 mb-5">Loan Account</p>
      <hr/>
      <br/>
      <div className="flex flex-row">
        <div className="m-auto flex-auto"> {/* <Search label="Search by Agreement ID" setter={setSearchString}/> */}</div>
        <div className="m-auto"><Link className={`${CreateButtonStyling} p-4`} to="create" state={{linkSource: "CREATE"}}>Add a Loan Account</Link></div>
      </div>
      <div className="m-5">
        {accountList
          ?accountList.length==0
            ?<EmptyPageMessage sectionName="loan accounts"/>
            :<DataTable 
              headingRows={["Sr. No.", "Agreement ID", "Company Name", "Group Name", "Zone", "Sanction Amount", "Action"]} headingClassNames={["w-[100px]"]}
              tableData={accountList} columnIDs={["AID", "CN", "GN", "Z", "SA"]} dataTypes={["index","text","text","text","text","text", "action"]} 
              cellClassName={["font-medium", "text-custom-1","","","","",""]} searchRows={[]} filterRows={[]}
              action = {accountList.map((item,index)=>{
                return(
                  <div className="flex flex-row">
                    <Link className="m-2" to="create" state={{linkSource: "EDIT", loanId: item["_id"], AID: item.AID}}><img src={edit_icon}/></Link>
                    <DeleteConfirmation thing="loan account" deleteFunction={deleteLoanAccount} currIndex={index}/>
                  </div>
                )
              })}
            />
          : <LoadingMessage sectionName="loan accounts"/>
        }
      </div>
      <br/>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default LoanAccount;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Table } from "@/components/ui/table";
//import Search from "./BasicComponents/Search";
import useGlobalContext from "./../../GlobalContext";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import edit_icon from "./static/edit_icon.svg";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
/* import delete_icon from "./static/delete_icon.svg";
import ActionDialog from "./BasicComponents/ActionDialog"; */

function LoanAccount() {
  const [accountList, setAccountList] = useState([]);

  const [ids, setIds] = useState([]);

  const {getLoanList, useTitle} = useGlobalContext();

  useTitle("Loan Account");
  
  useEffect(()=>{
    getLoanList().then(res=>{
      const arr:any=[];
      const idarr:any=[];
      res.map((deal:any)=>{
        arr.push([deal.AID, deal.CN, deal.GN, deal.Z, deal.SA,0]);
        idarr.push(deal._id);
      });
      setAccountList(res);
      setIds(idarr);
    })
  },[])

  //const [searchString, setSearchString] = useState("");
  
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
      <div className="m-5 ">
        {accountList.length==0
          ?<EmptyPageMessage sectionName="loan accounts"/>
          :<Table className="border rounded-xl">
            <HeaderRows headingRows={[["Sr. No.", "w-[100px]"], ["Agreement ID"], ["Company Name"], ["Group Name"], ["Zone"], ["Sanction Amount"], ["Status"], ["Action"]]} />
            <BodyRowsMapping 
              list={accountList} columns={["AID", "CN", "GN", "Z", "SA", "S"]}
              dataType={["index","text","text","text","text","text","text", "action"]} 
              cellClassName={["font-medium", "text-custom-1","","","","",""]} 
              searchRows={[]} filterRows={[]}
              action = {accountList.map((item:any, index:number)=>{
                return(
                  <div className="flex flex-row">
                    <Link className="m-2" to="create" state={{linkSource: "EDIT", loanId: ids[index], AID: item.AID}}><img src={edit_icon}/></Link>
                    {/* <ActionDialog trigger={<img src={delete_icon}/>} title="Delete User?" description="Are you sure you want to delete this user?" 
                      actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteUser(index)} 
                    /> */}
                  </div>
                )
              })}
            />
          </Table>
        }
      </div>
      <br/>
    </div>
  )
}

export default LoanAccount;
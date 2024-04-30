import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import PermissionSetter from "./BasicComponents/PermissionSetter";
import useGlobalContext from "./../../GlobalContext";
import FormDialog from "./BasicComponents/FormDialog";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
function RoleManagement(){
  const {addRole, getRolesList}= useGlobalContext();

  const [roleList, setRoleList] = useState([
    {N: "MAKER", P:{"Loan Account":["access", "edit"]}},
    {N: "CHECKER", P:["delete", "view"]}
  ]);

  const [fieldList, setFieldList] = useState([
    { id:"N", name: "Role Name", }
  ])

  useEffect(()=>{
    getRolesList().then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  });

  const createRole = (e:any) =>{
    e.preventDefault();
    console.log("CREATINGG")
    const x = JSON.stringify({"Loan Account":["view", "edit"]})
    const data={N: "Checker-2", P:x}

    addRole(data).then(res=>{
      console.log(res);
    })
    
  }
  return (
    <div>
			<p className="text-3xl font-bold m-7">Role Management</p>
      <PermissionSetter/>
      {/* {roleList.map(role=>{
        return(
        <Collapsible className="mx-7 my-3">
          <CollapsibleTrigger>{role.N}</CollapsibleTrigger>
          <CollapsibleContent>
            <PermissionSetter />
          </CollapsibleContent>
        </Collapsible>
        )
      })} */}
      <button onClick={createRole}>CREATE</button>
    </div>
  )
}

export default RoleManagement;
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import PermissionSetter from "./BasicComponents/PermissionSetter";
import useGlobalContext from "./../../GlobalContext";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { ChevronDown, ChevronRight } from "lucide-react";
//import Search from "./BasicComponents/Search";
import FormDialog from "./BasicComponents/FormDialog";
function RoleManagement(){
  //const {addRole, getRolesList}= useGlobalContext();

  //const [searchString, setSearchString] = useState("");
  const [open, setOpen] = useState<boolean[]>([]);

  const [roleList] = useState([
    { N: "MAKER", P:{
      "Loan Account":["access", "edit"]}
    },
    { N: "CHECKER", P:{
      "Loan Account": ["access", "edit"],
      "Product": ["view", "access"],
      "Transaction Documents": ["access", "edit"],
      "Compliance Documents": ["delete", "access"],
      "Covenants": [ "edit"],
    }}
  ]);

  const [newRole, setNewRole] = useState<any>({});

	const {useTitle} = useGlobalContext();

	useTitle("Role Management");

 /*  useEffect(()=>{
    getRolesList().then(res=>{
      if (res==null)
        return;
      setRoleList(res);
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  },[]);
 */
  const createRole = (e:any) =>{
    e.preventDefault();
    console.log("CREATINGG")
    console.log(newRole)

    /* addRole(data).then(res=>{
      console.log(res);
    }) */
    
  }

  const editRoles = (e:any) =>{
    e.preventDefault();
    console.log(roleList)
  }

  return (
    <div>
			<p className="text-3xl font-bold m-7">Role Management</p>
      <br/>
      <div className="flex flex-row">
        {/* <div className="flex-auto">
          <Search label="Search Role" setter={setSearchString} />
        </div> */}
        <div>
          <FormDialog
            triggerText="Create New Role" triggerClassName={CreateButtonStyling}
            formTitle="Create a New Role" formSize="small"
            formSubmit={createRole} submitButton="Create Role" setter={setNewRole}
            form={[
              { category: "single", id: "N", name:"Role Name", type: "text" },
              { category: "single", id: "P", name: "Permissions", type: "permissions"}
            ]}
          />
        </div>
      </div>
      {roleList.map((role,index)=>{
        return(
        <Collapsible key={index} className="mx-7 my-3">
          <CollapsibleTrigger className="font-medium text-xl mx-3 my-2" onClick={()=>{ const arr=[...open]; arr[index]=!open[index]; setOpen(arr)}}>
            <div className="flex flex-row">
              <div>{role.N}</div>
              <div>{open[index]?<ChevronDown className="mt-[1px]"/>:<ChevronRight className="mt-[2px]"/>}</div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <PermissionSetter singleRole={role["P"]} />
          </CollapsibleContent>
        </Collapsible>
        )
      })}

      <div><button className={`${CreateButtonStyling}`} onClick={editRoles}>Save</button></div>
      
    </div>
  )
}

export default RoleManagement;
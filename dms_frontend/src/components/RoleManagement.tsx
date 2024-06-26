import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";
import FormDialog from "./FormComponents/FormDialog";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

import { FieldValues, FieldAttributesList } from "DataTypes";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { ChevronDown, ChevronRight } from "lucide-react";
import PermissionsField from "./FormFieldComponents/PermissionsField";
import { useToast } from "./ui/use-toast";

function RoleManagement(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [roleList, setRoleList] = useState<any[]>();

  const [fieldList] = useState<FieldAttributesList>([
    { category: "single", id: "N", name:"Role Name", type: "text" },
    { category: "single", id: "P", name: "Permissions", type: "permissions", newRole:true }
  ]);

  const [open, setOpen] = useState<boolean[]>([]);
  const [added, setAdded] = useState(true);

	const { addRole, getRolesList} = useGlobalContext();

  const {toast} = useToast();
  
  useEffect(()=>{
    if (added){
      listRole();
      setAdded(false);
    }
  },[added]);

  useEffect(()=>{
    console.log("roleList values", roleList);
  },[roleList])

  const listRole = async () => {
    const res = await getRolesList();
    if (res.status==200){
      const arr = await res.data.map((obj:FieldValues)=>{
        const permissionObj = JSON.parse(obj["P"]?.toString()||"");
        obj["P"] = permissionObj;
        return obj;
      });
      setRoleList(arr);
    }
    else
      setRoleList([]);
  }

  const createRole = async (userData:FieldValues) => {
    const data:FieldValues = {}
    data["N"] = userData["N"];
    data["P"] = JSON.stringify(userData["P"]);
    
    console.log("SUBMITTED",data)

    const res = await addRole(data);

    if (res==200)
      setAdded(true);
    return res
  }

  const editRoles = async (roleIndex:number) =>{
    const roleData = {...roleList?.[roleIndex]};
    roleData["P"] = JSON.stringify(roleData["P"]);
    console.log("SUBMITTING",roleData);

    const res = await addRole(roleData);

    if (res==200){
      setAdded(true);
      toast({
        description:"Success!",
        duration:5000,
        className:"bg-white"
      })
    }
    else
      toast({
        description:"Something went wrong",
        duration:5000,
        className:"bg-white"
    })
  }

  return (
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br/>
      <div className="flex flex-row">
        <div className="flex-auto">
          {/* <Search label="Search Role" setter={setSearchString} /> */}
        </div>
        <div>
        <FormDialog key={-10} index={-10} edit={false} type="user"
          triggerText="+ Add Role" triggerClassName={`${CreateButtonStyling} mx-5`} formSize="medium"
          formTitle="Add Role" formSubmit={createRole} submitButton="Add Role"
          form={fieldList} currentFields={{}}
        />
        </div>
      </div>
      {roleList==undefined
        ?<LoadingMessage sectionName="data" />
        :roleList.length==0
          ?<EmptyPageMessage sectionName="roles" />
          :<div>
            <p className="mx-7 text-2xl font-bold">Defined User Roles</p>
            <div>
              {roleList.map((singleRole:any,index:number)=>{
                return(
                  <Collapsible key={index} className="mx-7 my-3">
                    <CollapsibleTrigger className="font-medium text-xl mx-3 my-2" onClick={()=>{ const arr=[...open]; arr[index]=!open[index]; setOpen(arr)}}>
                      <div className="flex flex-row">
                        <div>{singleRole.N}</div>
                        <div>{open[index]?<ChevronDown className="mt-[1px]"/>:<ChevronRight className="mt-[2px]"/>}</div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <PermissionsField key={index} index={index} id="P" name="" permissionPreset={singleRole.P} required={false} disabled={false} setPermissionSet={setRoleList} multiple />
                      <button className={`rounded-xl p-2 text-white text-lg align-middle bg-custom-1 my-3`} onClick={()=>editRoles(index)}>Save Changes for {singleRole.N}</button>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
            
          </div>     
      }
    </div>
  )
}

export default RoleManagement;
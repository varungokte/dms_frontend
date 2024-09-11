import { useContext, useEffect, useState } from "react";
import { FieldAttributesList } from "@/types/FormAttributes";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { PermissionContext } from "@/functions/Contexts";
import reorganizePermissions from "@/functions/reorganizePermissions";
import { addRole, getRolesList } from "@/apiFunctions/roleAPIs";

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";

import FormDialog from "./FormComponents/FormDialog";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import PermissionsField from "./FormFieldComponents/PermissionsField";
import Toast from "./BasicComponents/Toast";
import SubmitButton from "./BasicButtons/SubmitButton";
import AddButton from "./BasicButtons/AddButton";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function RoleManagement(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [roleList, setRoleList] = useState<any[]>();

  const fieldList:FieldAttributesList = [
    { category: "single", id: "N", name:"Role Name", type: "text", required:true },
    { category: "single", id: "P", name: "Permissions", type: "permissions", newRole:true }
  ];

  const [addOpen, setAddOpen] = useState([false]);
  const [editOpen, setEditOpen] = useState<boolean[]>([]);

  const [added, setAdded] = useState(true);
  const [names, setNames] = useState<string[]>([]);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const {userPermissions} = useContext(PermissionContext);
  
  useEffect(()=>{
    if (added){
      listRole();
      setAdded(false);
    }
  },[added]);

  /* useEffect(()=>{
    console.log("roleList values", roleList);
  },[roleList]) */

  const listRole = async () => {
    const res = await getRolesList();
    if (res.status==200){
      const data = res.data[0]["data"];
      const nameArr:string[] = [];
      try{
        const arr = await data.map((obj:FieldValues)=>{
          const permissionObj = JSON.parse(obj["P"]?.toString()||"");
          obj["P"] = permissionObj;
          nameArr.push(obj["N"]);
          setNames(nameArr);
          return obj;
        });
        for (let i=0; i<arr.length; i++){
          const values = arr[i];
          if (values["P"]){
            const obj = reorganizePermissions.incoming(values["P"]);
            values ["P"] = {...obj}
          }
        }
        setRoleList(arr);
      }
      catch(e){
        setRoleList([])
      }
      }
      
    else
      setRoleList([]);
  }

  const createRole = async (userData:FieldValues) => {
    const data:FieldValues = {}
    data["N"] = userData["N"];
    console.log("new role created",{...userData});

    data["P"] = JSON.stringify(reorganizePermissions.outgoing(userData["P"]));
    

    const res = await addRole(data);

    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Role"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Role"});
    return res;
  }

  const editRoles = async (roleIndex:number) =>{
    const roleData = {...roleList?.[roleIndex]};
    roleData["P"] = JSON.stringify(reorganizePermissions.outgoing(roleData["P"]));
    roleData["N"] = names[roleIndex];
    console.log("role edited",roleData);

    const res = await addRole(roleData);
    
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"edit", section:"Role"});
    }
    else
      setToastOptions({open:true, type:"error", action:"edit", section:"Role"});
  }

  return (
    <div>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="flex flex-row">
        <div className="flex-auto">
          {/* <Search label="Search Role" setter={setSearchString} /> */}
        </div>
        <div>
        {userPermissions["role"].includes("add")
          ?<div>
            <AddButton sectionName="role" onClick={()=>setAddOpen([true])} />
            {addOpen[0]
              ?<FormDialog key={0} index={0} edit={false} type="user"
                formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="md"
                formTitle="Add Role" formSubmit={createRole} submitButton="Add Role"
                form={fieldList} currentFields={{}}
              />
              :<></>
            }
          </div>
          :<></>
        }
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
                    <CollapsibleTrigger className="font-medium text-xl mx-3 my-2" onClick={()=>{ const arr=[...editOpen]; arr[index]=!editOpen[index]; setEditOpen(arr)}} disabled={!userPermissions["role"].includes("view")}>
                      <div className="flex flex-row ">
                        <div>{singleRole.N}</div>
                        {userPermissions["role"].includes("view")?<div>{editOpen[index]?<ExpandMoreIcon fontSize="medium"/>:<ChevronRightIcon fontSize="medium" />}</div>:<></>}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mx-3">
                        <label className="mr-1">Change Role Name:</label> <input className="" value={names[index]||""} onChange={(e)=>setNames(curr=>{curr[index]=e.target.value; return [...curr];})}/>
                      </div>
                      <div className="m-auto"><PermissionsField key={index} index={index} fieldData={{id:"P", name:"", type:"permissions", required:false, multiple:true}} permissionSet={singleRole.P}  disabled={!userPermissions["role"].includes("edit")} setPermissionSet={setRoleList} />  </div>
                      {userPermissions["role"].includes("edit")
                        ?<SubmitButton submitFunction={editRoles} index={index} submitButtonText={`Save Changes for ${singleRole.N}`} />
                        :<></>
                      }
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
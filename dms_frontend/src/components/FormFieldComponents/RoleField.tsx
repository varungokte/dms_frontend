import { useEffect, useState } from "react";
import SelectField from "./SelectField";
import PermissionsField from "./PermissionsField";
import { FieldValues } from "DataTypes";

function RoleField (props:{index:number, id: string, name:string, roleList:FieldValues[], required?:boolean, disabled?:boolean, prefillValues:any, setPrefillValues:Function}){
  const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
  const [currentRole, setCurrentRole] = useState("");
  const [showRolePreset, setShowRolePreset] = useState(false);

  useEffect(()=>console.log(props),[props])

  useEffect(()=>{
    if (props.prefillValues["R"] && props.prefillValues["R"]!=currentRole){
      if (currentRole!="" || !props.prefillValues["UP"] || (props.prefillValues["UP"] && Object.keys(props.prefillValues["UP"]).length==0))
        setShowRolePreset(true);

      setCurrentRole(props.prefillValues["R"]);
    }
  },[props.prefillValues])

  useEffect(()=>{
    if (props.roleList==undefined)
      return;
    const obj:any={}
    for (let i=0; i<props.roleList.length; i++)
      obj[props.roleList[i]["N"]]=props.roleList[i]["P"];
    setAllRolesPermissionsList(obj);
  },[props.roleList])

  useEffect(()=>{
    if (showRolePreset){
      props.setPrefillValues((curr:any)=>{
        curr["UP"]=allRolesPermissionsList[currentRole];
        return {...curr};
      })}
  },[allRolesPermissionsList,currentRole])

  return (
    <div>
      <SelectField index={props.index} id={props.id} name={props.name} options={["-"].concat(Object.keys(allRolesPermissionsList))} required={props.required} disabled={props.disabled} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} />
      {currentRole==""
        ?<></>
        :<PermissionsField index={props.index} id={"UP"} name={"Permission"} 
          permissionPreset={props.prefillValues["UP"]} 
          required={props.required} disabled={props.disabled} 
          setPermissionSet={props.setPrefillValues}
        />
      }
    </div>
  )
};

export default RoleField
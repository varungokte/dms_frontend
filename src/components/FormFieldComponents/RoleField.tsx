import { useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldAttributes } from "@/types/FormAttributes";

import SelectField from "./SelectField";
import PermissionsField from "./PermissionsField";

function RoleField (props:{index:number, fieldData:FormFieldAttributes, roleList:FieldValues[], prefillValues:any, error?:boolean, setPrefillValues:Function, disabled:boolean}){
  try{
    const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
    const [currentRole, setCurrentRole] = useState<string>();
    const [firstTime, setFirstTime] = useState(true);
    const [permissionsExist, setPermissionsExist] = useState(false);
  
    useEffect(()=>console.log("role props",props),[props])

    useEffect(()=>console.log("permissions exisit",permissionsExist),[permissionsExist])
  
    useEffect(()=>{
      //console.log("props.prefillValues",props.prefillValues)
      if (!props.prefillValues)
        return;
      else if (firstTime){
        setFirstTime(false);
        if (Object.keys(props.prefillValues).length!=0)
          setPermissionsExist(true);
        else
          setPermissionsExist(false);
      }/* 
      else if (!props.prefillValues["UP"])
        setPermissionsExist(false); */
  
      if (currentRole!=props.prefillValues["R"]){
        setCurrentRole(props.prefillValues["R"]);
        if (currentRole)
          setPermissionsExist(false);
      }
    },[props.prefillValues]);
  
    //useEffect(()=>console.log("permissionsExist has been changed",permissionsExist),[permissionsExist])
  
    useEffect(()=>{
      if (props.roleList==undefined)
        return;
      const obj:any={}
      for (let i=0; i<props.roleList.length; i++)
        obj[props.roleList[i]["N"]]=props.roleList[i]["P"];
      setAllRolesPermissionsList(obj);
    },[props.roleList]);
  
    useEffect(()=>{
      if (!currentRole)
        return;
      //console.log("permissions exisit",permissionsExist)
      if (!permissionsExist){
        props.setPrefillValues((curr:any)=>{
          curr["UP"]= allRolesPermissionsList[currentRole];
          return {...curr};
        })
      }
    },[allRolesPermissionsList,currentRole,permissionsExist])
  
    return (
      <div>
        <SelectField index={props.index} fieldData={{id:props.fieldData.id, name:props.fieldData.name, type:"select", options:["-"].concat(Object.keys(allRolesPermissionsList)),required:props.fieldData.required}}  prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} disabled={props.disabled} error={props.error} />
        {currentRole
          ?<PermissionsField index={props.index} fieldData={{id:"UP", name:"Permissions", type:"permissions", required:props.fieldData.required, disabled:props.fieldData.disabled}}  permissionPreset={props.prefillValues["UP"]} setPermissionSet={props.setPrefillValues}disabled={props.disabled} />
          :<></>
        }
      </div>
    )
  }
  catch(e){
    return <p className="my-5 text-red-600">An error has occured</p>
  }
};

export default RoleField;
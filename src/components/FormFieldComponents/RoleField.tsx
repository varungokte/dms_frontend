import { useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import reorganizePermissions from "@/functions/reorganizePermissions";
import { FormFieldProps } from "@/types/FormComponentProps";

import { Skeleton } from "@mui/material";
import SelectField from "./SelectField";
import PermissionsField from "./PermissionsField";

function RoleField (props:FormFieldProps & {roleList:FieldValues[], permissionSet:FieldValues}){
  try{
    const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
    const [currentRole, setCurrentRole] = useState<string>();
    const [firstTime, setFirstTime] = useState(true);
    const [permissionsExist, setPermissionsExist] = useState(false);
  
    //useEffect(()=>console.log("permissions exisit",permissionsExist),[permissionsExist])
  
    useEffect(()=>{
      //console.log("props.prefillValues",props.prefillValues)
      if (!props.fieldValue)
        return;
      else if (firstTime){
        setFirstTime(false);
        if (props.fieldValue && Object.keys(props.fieldValue).length!=0)
          setPermissionsExist(true);
        else
          setPermissionsExist(false);
      }/* 
      else if (!props.prefillValues["UP"])
        setPermissionsExist(false); */
  
      if (currentRole!=props.fieldValue){
        setCurrentRole(props.fieldValue);
        if (currentRole)
          setPermissionsExist(false);
      }
    },[props.fieldValue]);
  
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
      if (!permissionsExist){
        props.setFieldValues((curr:any)=>{
          curr[props.fieldData.permissionId||"UP"]= reorganizePermissions.incoming(allRolesPermissionsList[currentRole]);
          return {...curr};
        })
      }
    },[allRolesPermissionsList,currentRole,permissionsExist]);

    if (currentRole && (!allRolesPermissionsList || Object.keys(allRolesPermissionsList).length==0)){
      return (
        <div>
          <Skeleton variant="rectangular" width={"100%"} height={50} />
          <br />
        <div className="flex flex-row">
          <div className="mx-3">
            <Skeleton variant="rectangular" width={150} height={200} />
          </div>
          <div className="mx-3">
            <Skeleton variant="rectangular" width={300} height={200} />
          </div>
        </div>
        </div>
      )
    }
    return (
      <div>
        <SelectField index={props.index} fieldData={{id:props.fieldData.id, name:props.fieldData.name, type:"select", options:["-"].concat(Object.keys(allRolesPermissionsList)),required:props.fieldData.required}}  fieldValue={props.fieldValue} setFieldValues={props.setFieldValues} disabled={props.disabled} error={props.error} />
        {currentRole
          ?<PermissionsField index={props.index as number} fieldData={{id:props.fieldData.permissionId||"UP", name:"Permissions", type:"permissions", required:props.fieldData.required, disabled:props.fieldData.disabled}} fieldValue={props.permissionSet} setFieldValues={props.setFieldValues}disabled={props.disabled} />
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

/* 
    console.log("la forge",props.prefillValues)
    if (currentRole && (!allRolesPermissionsList || Object.keys(allRolesPermissionsList).length==0)){
      return (
        <div className="flex flex-row">
          <div className="mx-3">
            <Skeleton variant="rectangular" width={150} height={200} />
          </div>
          <div className="mx-3">
            <Skeleton variant="rectangular" width={300} height={200} />
          </div>
        </div>
      )}
    else */
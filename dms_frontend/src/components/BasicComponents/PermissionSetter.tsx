import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function PermissionSetter(props:{newRole:boolean, setter:Function, setPrefillValues:Function, permissionSet:any}){
  const [permissionTypes] = useState (["access", "view", "delete","add","edit"]);

  const [permissionList, setPermissionList] = useState({
    "Loan Account": [],
    "Product": [],
    "Transaction Documents": [],
    "Compliance Documents": [],
    "Covenants": [],
  });

  /* useEffect(()=>{
    console.log("the permission list has changed", permissionList);
  },[permissionList]) */

  useEffect(()=>{
    //console.log("props.singleRole",props.permissionSet)
    if (props.permissionSet)
      setPermissionList(props.permissionSet);
    else
      setPermissionList({
        "Loan Account": [],
        "Product": [],
        "Transaction Documents": [],
        "Compliance Documents": [],
        "Covenants": [],
      })
  },[props.permissionSet])

  /* useEffect(()=>{
    console.log("CURRENT PERMISSIONS LIST", permissionList)
  },[permissionList]) */

  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    else
     permissions = permissions.filter(name=> name!==action);
    
    if (props.setter){
      props.setter((curr:any)=>{
        curr["P"][section] = [...permissions];
        console.log("new setter curr", curr)
        return {...curr};
      })
      setPermissionList((curr:any)=>{
        curr[section] = [...permissions];
        console.log("NEW CURR",curr)
        return {...curr};
      })
    }
    else
      setPermissionList((curr:any)=>{
        curr[section] = [...permissions];
        return {...curr};
      })
  }
  
  return (
    <div className="mx-1">
      <Table className="rounded-xl bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Modules</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>Add</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(permissionList).map((section,index)=>{
            return (
              <TableRow key={index}>
                <TableCell key={index+"s"}>{section}</TableCell>
                {permissionTypes.map(action=>{
                  return (
                    <TableCell key={index+action}>
                      <input 
                        type="checkbox"
                        //@ts-ignore
                        checked={permissionList[section].includes(action)}
                        //@ts-ignore
                        onChange={(e)=>{
                          //@ts-ignore
                          togglePermission(permissionList[section],action,e.target.checked,section);
                        }}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default PermissionSetter;
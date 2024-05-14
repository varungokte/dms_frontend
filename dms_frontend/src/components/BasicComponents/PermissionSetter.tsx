import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function PermissionSetter(props:any){
  const [permissionTypes] = useState (["access", "view", "delete","add","edit"]);

  const [permissionList, setPermissionList] = useState({
    "Loan Account": ["access", "view", "delete","add","edit"],
    "Product": ["access", "view", "delete","add","edit"],
    "Transaction Documents": ["access", "view", "delete","add","edit"],
    "Compliance Documents": ["access", "view", "delete","add","edit"],
    "Covenants": ["access", "view", "delete","add","edit"],
  });

  useEffect(()=>{
    if (props.singleRole)
      setPermissionList(props.singleRole);
    console.log("PROPS.singlerole",props.singleRole)
  },[props.singleRole])

  useEffect(()=>{
    console.log("CURRENT PERMISSIONS LIST", permissionList)
  },[permissionList])

  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    
    else
     permissions = permissions.filter(name=> name!==action);
    
    if (props.setter){
      props.setter((curr:any)=>{
        //@ts-ignore
        curr[section] = [...permissions];
        return {...curr};
      })
      setPermissionList(curr=>{
        //@ts-ignore
        curr[section] = [...permissions];
        console.log("NEW CURR",curr)
        return {...curr};
      })
    }
    else
      setPermissionList(curr=>{
        //@ts-ignore
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
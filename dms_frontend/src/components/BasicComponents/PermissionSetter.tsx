import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


function PermissionSetter(props:any){
  const [permissionTypes] = useState (["access", "view", "delete",]);

  const [permissionList, setPermissionList] = useState({
    "Loan Account": [],
    "Product": [],
    "Transaction Documents": [],
    "Compliance Documents": [],
    "Covenants": [],
  });

  useEffect(()=>{
    if (!props.newRole)
      setPermissionList(props.singleRole);
  },[])


  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    
    else
     permissions = permissions.filter(name=> name!==action);
    
    if (props.setter)
      props.setter((curr:any)=>{
        //@ts-ignore
        curr[section] = [...permissions];
        return curr;
      })
    else
      setPermissionList(curr=>{
        //@ts-ignore
        curr[section] = [...permissions];
        return curr;
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
                        defaultChecked={permissionList[section].includes(action)}
                        //@ts-ignore
                        value={permissionList[section].includes(action)?true:false} 
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
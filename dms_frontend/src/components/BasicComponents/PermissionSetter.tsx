import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


function PermissionSetter(props:any){
  const [permissionTypes] = useState (["access", "view", "delete",])

  const [permissionList, setPermissionList] = useState({
    "Loan Account": ["access", "edit"],
    "Product": ["view", "access"],
    "Transaction Documents": ["access", "edit"],
    "Compliance Documents": ["delete", "access"],
    "Covenants": [ "edit"],
  });


  console.log(permissionList)

  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    
    else
     permissions = permissions.filter(name=> name!==action);
     
    setPermissionList(curr=>{
      console.log("NEW PERMISSIONS", permissions);
      //@ts-ignore
      curr[section] = [...permissions];
      console.log("OBJ",curr)
      return curr;
    })
  }
  
  return (
    <div className="mx-1">
      <p className="mx-1 text-2xl">Permissions</p>
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
                        checked={permissionList[section].includes(action)?true:false} 
                        onChange={(e)=>{
                          //@ts-ignore
                          console.log(index,action, permissionList[section].includes(action))
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
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function PermissionSetter(props:{ setter:Function, permissionSet:any}){
  const [permissionTypes] = useState (["access", "view", "delete","add","edit"]);

  /* const [permissionList, setPermissionList] = useState<any>({
    "Loan Account": [],
    "Product": [],
    "Transaction Documents": [],
    "Compliance Documents": [],
    "Covenants": [],
  });

  useEffect(()=>{
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
  },[props.permissionSet]) */

  /* useEffect(()=>{
    console.log("CURRENT PERMISSIONS LIST", permissionList)
  },[permissionList]) */

  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    else
     permissions = permissions.filter(name=> name!==action);

    props.setter((curr:any)=>{
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
          {Object.keys(props.permissionSet).map((section,index)=>{
            return (
              <TableRow key={index}>
                <TableCell key={index+"s"}>{section}</TableCell>
                {permissionTypes.map(action=>{
                  return (
                    <TableCell key={index+action}>
                      <input 
                        type="checkbox"
                        checked={props.permissionSet[section].includes(action)}
                        onChange={(e)=>{
                          togglePermission(props.permissionSet[section],action,e.target.checked,section);
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
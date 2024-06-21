import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../../ui/table";
import { useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";


function PermissionsField (props:{index:number, id: string, name:string, permissionPreset:any, required:boolean, disabled:boolean, setPermissionSet:Function, multiple?:boolean}){
  const [permissionTypes] = useState (["access", "view", "delete","add","edit"]);

  useEffect(()=>{
    if (props.multiple && props.permissionPreset.length==0)
      props.setPermissionSet((curr:any)=>{
        curr[props.id]=[{ "Loan Account":[], "Product": [], "Transaction Documents": [], "Compliance Documents": [], "Covenants": [] }];
        return {...curr};
      }
    );
    else if (props.permissionPreset && Object.keys(props.permissionPreset).length==0)
      props.setPermissionSet( (curr:any)=>{
        curr[props.id]={ "Loan Account":[], "Product": [], "Transaction Documents": [], "Compliance Documents": [], "Covenants": [] };
        return {...curr};
      }
    );
  },[props.permissionPreset])
  
  const togglePermission = (permissions: string[], action: string, value:boolean, section: string) => {
    if (value)
      permissions.push(action);
    else
      permissions = permissions.filter(name=> name!==action);
    
    if (props.multiple)
      props.setPermissionSet((curr:any)=>{
        curr[props.index][props.id][section] = [...permissions];
        return [...curr];
      })
    
    else
      props.setPermissionSet((curr:any)=>{
        curr[props.id][section] = [...permissions];
        return {...curr};
      })
  }

  return (
    <div key={props.index}>
      <div className="mx-2"><FieldLabel index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} /></div>
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
          {props.permissionPreset
            ?Object.keys(props.permissionPreset).map((section,index)=>{
              return (
                <TableRow key={index}>
                  <TableCell key={index+"s"}>{section}</TableCell>
                  {permissionTypes.map(action=>{
                    return (
                      <TableCell key={index+action}>
                        <input 
                          type="checkbox"
                          checked={props.permissionPreset[section].includes(action)}
                          onChange={(e)=>{
                            togglePermission(props.permissionPreset[section],action,e.target.checked,section);
                          }}
                        />
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
            :<></>
          }
        </TableBody>

      </Table>
    </div>
  )
};

export default PermissionsField;
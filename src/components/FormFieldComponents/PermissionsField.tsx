import { useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import { getDocSecList, getModSecList, getModSecName } from "@/functions/sectionNameAttributes";
import { FormFieldAttributes } from "@/types/FormAttributes";

import FieldLabel from "./FieldLabel";
import Tabs from "@mui/material/Tabs/Tabs";
import Tab from "@mui/material/Tab/Tab";
import Button from "@mui/material/Button/Button";
import Box from "@mui/material/Box/Box";
import reorganizePermissions from "@/functions/reorganizePermissions";
import { allSectionPermissions } from "@/functions/Constants";

function PermissionsField (props:{index:number, fieldData:FormFieldAttributes, permissionSet:FieldValues, setPermissionSet:Function, disabled:boolean}){
  try{
    const [category, setCategory] = useState("admin");
    const documentSections = getDocSecList("shortname");
    const docSubTypes:FieldValues = {
      docs: "Document Details",
      file: "File"
    }

    useEffect(()=>console.log("permission props",props),[props]);
    
    const emptyPermisionSet = () => {
      //if props.prefillValues[props.id] is not there, this function will set it to {}, which is better than being undefined

      const obj:FieldValues={};

      getModSecList("shortname").map(section=>{
        if (documentSections.includes(section))
          obj[section] = {docs:[],file:[]}
        else
          obj[section]=[]
      });

      
      if (props.fieldData.multiple && props.permissionSet.length==0){
        props.setPermissionSet((curr:any)=>{
          curr[props.fieldData.id] = obj;
          return {...curr};
        })
      }

      else if (props.permissionSet && Object.keys(props.permissionSet).length==0){
        const reorgainzed = reorganizePermissions.incoming(obj);
        props.setPermissionSet((curr:any)=>{
          curr[props.fieldData.id] = reorgainzed;
          console.log("NEW CURR",{...curr})
          return {...curr};
        }
        );
      }
    }
    useEffect(()=>{
      emptyPermisionSet();
    },[props.permissionSet]);

    return (
      <div>
        <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <Box sx={{ flexGrow:1, display:"flex" }} >
          <Tabs orientation="vertical" variant="scrollable" 
            sx={{ borderRight: 1, borderColor: "divider", textAlign:"right"}}
            value={category} onChange={(_:any,val:string)=>setCategory(val)}
          >
            <Tab label="Admin Pages"  value="admin" className="w-full" sx={{alignItems:"end"}}/>
            <Tab label="Loan Account" value="loan" sx={{alignItems:"end"}} />
            <Tab label="Documents" value="documents" sx={{alignItems:"end"}} />
            <Tab label="Reminders" value="reminders" sx={{alignItems:"end"}} />
          </Tabs>
          <div className="mx-5">
            {props.permissionSet && Object.keys(props.permissionSet).length!=0
              ?props.permissionSet[category] && Object.keys(props.permissionSet[category]).map((section:string,index:number)=>{
                try{
                  const sectionPermissions = props.permissionSet[category][section];
                  
                  return(
                    <div key={index}>
                      <p className="text-xl">{getModSecName({inputName:section, inputType:"shortname",outputType:"fullname"})}</p>
                      {category=="documents"
                        ?Object.keys(sectionPermissions).map((subsection,subindex)=>{
                          return <div key={index+"_"+subindex}>
                            <p>{docSubTypes[subsection]}</p>
                            <RenderPermissions index={props.index} id={props.fieldData.id} sectionName={subsection} documentSection={section} permissionSet={sectionPermissions[subsection]} setPermissionSet={props.setPermissionSet} category={category} disabled={props.disabled} multiple={props.fieldData.multiple} />
                            <br />
                          </div>
                        })
                        :<RenderPermissions index={props.index} id={props.fieldData.id} sectionName={section} permissionSet={sectionPermissions} setPermissionSet={props.setPermissionSet} category={category} disabled={props.disabled} multiple={props.fieldData.multiple} />
                      }
                      <br />
                    </div>
                  )
                }
                catch(e){
                  return <p key={index} className="my-5 text-red-600">An error has occured</p>
                }
              })
              :<></>
            }
          </div>
        </Box>
        <br />
      </div>
    )
  }
  catch(e){console.log(e)
    return <p className="my-5 text-red-600">An error has occured</p>
  }
};

function RenderPermissions(props:{index:number, id:string, category:string, sectionName:string, documentSection?:string, permissionSet:any, setPermissionSet:Function, disabled?:boolean, multiple?:boolean}){
  const permissionLabels:FieldValues = {
    "access":"page access",
    "view":"view",
    "add":"add",
    "edit":"edit",
    "delete":"delete",
    "select":"select",
    "view files":"view",
  };
  
  const documentSections = getDocSecList("shortname");
    
  return (
    <div>
      {(allSectionPermissions[props.sectionName]||[]).map((perm:string)=>{
        return (
          <Button key={props.index+perm} id={props.sectionName+props.index}
            disableRipple={props.disabled} className={`${props.disabled?"hover:cursor-default	":""}`} disableFocusRipple={props.disabled}
            variant={props.permissionSet.includes(perm)?"contained":"outlined"} 
            color="secondary"
            sx={{borderRadius:20, marginRight:"7px"}}
            onClick={()=>{
              try{
                if (props.disabled)
                  return;
                props.setPermissionSet((curr:any)=>{
                  if (!curr) return;
                  let singleSectionPermission;
                  if (props.multiple){
                    singleSectionPermission = props.documentSection && documentSections.includes(props.documentSection)
                      ?curr[props.index][props.id][props.category][props.documentSection][props.sectionName]
                      :curr[props.index][props.id][props.category][props.sectionName]
                  }
                    
                  else{
                    singleSectionPermission = props.documentSection && documentSections.includes(props.documentSection)
                      ?curr[props.id][props.category][props.documentSection][props.sectionName]
                      :curr[props.id][props.category][props.sectionName]
                  }
                  if (singleSectionPermission.includes(perm)){
                    const num = singleSectionPermission.indexOf(perm);
                    singleSectionPermission.splice(num,1);
                  }
                  else
                    singleSectionPermission.push(perm);

                  if (props.multiple)
                    return [...curr];
                  else
                    return {...curr};
                }) 
              }
              catch(e){console.log("err",e)}
            }} 
          >
            {permissionLabels[perm]}
          </Button>
        )
      })}
    </div>
  )
}

export default PermissionsField;
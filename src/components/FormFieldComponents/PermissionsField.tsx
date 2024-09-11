import { useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import { getDocSecList, getModSecList, getModSecName } from "@/functions/sectionNameAttributes";
import reorganizePermissions from "@/functions/reorganizePermissions";
import { allSectionPermissions } from "@/functions/Constants";
import { FormFieldProps } from "@/types/FormComponentProps";

import FieldLabel from "./FieldLabel";
import Tabs from "@mui/material/Tabs/Tabs";
import Tab from "@mui/material/Tab/Tab";
import Button from "@mui/material/Button/Button";
import Box from "@mui/material/Box/Box";

function PermissionsField (props:FormFieldProps){
  try{
    const [category, setCategory] = useState("ad");
    const documentSections = getDocSecList("shortname");
    const docSubTypes:FieldValues = {
      docs: "Document Details",
      file: "File"
    }

    //useEffect(()=>console.log("permission props",props),[props]);
    
    const emptyPermisionSet = () => {
      //if props.prefillValues[props.id] is not there, this function will set it to {}, which is better than being undefined

      const obj:FieldValues={};

      getModSecList("shortname").map(section=>{
        if (documentSections.includes(section))
          obj[section] = {docs:[],file:[]}
        else
          obj[section]=[]
      });

      
      if (props.fieldData.multiple && props.fieldValue.length==0){
        props.setFieldValues((curr:any)=>{
          curr[props.fieldData.id] = obj;
          return {...curr};
        })
      }

      else if (props.fieldValue && Object.keys(props.fieldValue).length==0){
        const reorgainzed = reorganizePermissions.incoming(obj);
        props.setFieldValues((curr:any)=>{
          curr[props.fieldData.id] = reorgainzed;
          return {...curr};
        }
        );
      }
    }
    useEffect(()=>{
      emptyPermisionSet();
    },[props.fieldValue]);
    
    console.log("props.permissionSet",props.fieldValue);
    return (
      <div>
        <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <Box sx={{ flexGrow:1, display:"flex" }} >
          <Tabs orientation="vertical" variant="scrollable" 
            sx={{ borderRight: 1, borderColor: "divider", textAlign:"right"}}
            value={category} onChange={(_:any,val:string)=>setCategory(val)}
          >
            <Tab label="Admin Pages"  value="ad" className="w-full" sx={{alignItems:"end"}}/>
            <Tab label="Loan Account" value="lo" sx={{alignItems:"end"}} />
            <Tab label="Documents" value="do" sx={{alignItems:"end"}} />
            <Tab label="Reminders" value="re" sx={{alignItems:"end"}} />
          </Tabs>
          <div className="mx-5">
            {props.fieldValue && Object.keys(props.fieldValue).length!=0
              ?props.fieldValue[category] && Object.keys(props.fieldValue[category]).map((section:string,index:number)=>{
                try{
                  const sectionPermissions = props.fieldValue[category][section];
                  //console.log("section Permissions for",category,section,sectionPermissions);
                  //console.log("props.permissionSet[category]",props.permissionSet[category]);
                  //console.log("props.permissionSet[category][section]",props.permissionSet[category][section])
                  return(
                    <div key={index}>
                      <p className="text-xl">{getModSecName({inputName:section, inputType:"shortname",outputType:"fullname"})}</p>
                      {category=="do"
                        ?Object.keys(sectionPermissions).map((subsection,subindex)=>{
                          return <div key={index+"_"+subindex}>
                            <p>{docSubTypes[subsection]}</p>
                            <RenderPermissions index={props.index as number} id={props.fieldData.id} sectionName={subsection} documentSection={section} permissionSet={sectionPermissions[subsection]} setPermissionSet={props.setFieldValues} category={category} disabled={props.disabled} multiple={props.fieldData.multiple} />
                            <br />
                          </div>
                        })
                        :<RenderPermissions index={props.index as number} id={props.fieldData.id} sectionName={section} permissionSet={sectionPermissions} setPermissionSet={props.setFieldValues} category={category} disabled={props.disabled} multiple={props.fieldData.multiple} />
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
        //console.log("using props.permissionset.includes",props.permissionSet);
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
                  console.log("setPermissionSet");
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
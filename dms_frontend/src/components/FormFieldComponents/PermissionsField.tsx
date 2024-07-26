import { useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";
import { getDocSecList, sectionNames } from "./../../../Constants";
import { FieldValues, FormFieldAttributes } from "./../../../DataTypes";
import Box from "@mui/material/Box/Box";
import Tabs from "@mui/material/Tabs/Tabs";
import Tab from "@mui/material/Tab/Tab";
import Button from "@mui/material/Button/Button";

function PermissionsField (props:{index:number, fieldData:FormFieldAttributes, permissionPreset:any,  setPermissionSet:Function, disabled:boolean}){
  try{
    const [value, setValue] = useState("admin");
    const [permissionSections, setPermissionSections] = useState<FieldValues>();
    const documentSections = getDocSecList("shortname");
    const docSubTypes:FieldValues = {
      docs: "Document Details",
      file: "File"
    }

    //useEffect(()=>console.log("permission props",props),[props])

    const sortByCategory = () => {
      if (!props.permissionPreset)
        return;
      const obj:FieldValues= {};

      const reorganized:{[key:string]:string[]} = {
        "admin":["masters","role","user","team"],
        "loan":["loan","contact"],
        "documents":["transaction","compliance","covenants","precedent","subsequent","payment"],
        "reminders":["reminders","default","critical"],
      };

      for (let i=0; i<documentSections.length; i++)
        reorganized[documentSections[i]] = ["docs","file"]

      for (let i=0; i<Object.keys(reorganized).length; i++){
        const category = Object.keys(reorganized)[i];
        obj[category] = {};
        for (let j=0; j<reorganized[category].length; j++){
          const section = reorganized[category][j];
          if (documentSections.includes(category)) 
            obj[category][section] = props.permissionPreset[category]&&props.permissionPreset[category][section]?props.permissionPreset[category][section]:[]
          else
            obj[category][section] = props.permissionPreset[section];
        }
      }
      //console.log("OBJ",obj)
      setPermissionSections(obj);
    }

    const emptyPermisionSet = () => {
      const obj:FieldValues={};
      Object.values(sectionNames).map(section=>{
        if (documentSections.includes(section))
          obj[section] = {docs:[],file:[]}
        else
          obj[section]=[]
      });

      if (props.fieldData.multiple && props.permissionPreset.length==0){
        props.setPermissionSet((curr:any)=>{
          curr[props.fieldData.id] = obj;
          return {...curr};
        })
      }

      else if (props.permissionPreset && Object.keys(props.permissionPreset).length==0){
        props.setPermissionSet( (curr:any)=>{
          curr[props.fieldData.id] = obj;
          return {...curr};
        }
        );
      }
    }

    useEffect(()=>{
      sortByCategory();
      emptyPermisionSet();
    },[props.permissionPreset]);

    //useEffect(()=>{if (permissionSections)console.log("value",permissionSections["documents"])},[permissionSections])
    
  /* 
    useEffect(()=>{
      props.setPermissionSet((curr:any)=>{
        console.log("old curr",curr);
        curr["UP"]=permissions;
        console.log("new curr",curr);
      });
    },[permissions]); */

    //useEffect(()=>console.log("PROPS.PERMISSIONPRESET",props.permissionPreset),[props.permissionPreset]);

    return (
      <div>
        <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <Box
          sx={{ flexGrow: 1, display: 'flex' }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={(_:any,val:string)=>setValue(val)}
            sx={{ borderRight: 1, borderColor: "divider", textAlign:"right"}}
          >
            <Tab label="Admin Pages"  value="admin" className="w-full" sx={{alignItems:"end"}}/>
            <Tab label="Loan Account" value="loan" sx={{alignItems:"end"}} />
            <Tab label="Documents" value="documents" sx={{alignItems:"end"}} />
            <Tab label="Reminders" value="reminders" sx={{alignItems:"end"}} />
          </Tabs>
          <div className="mx-5">
            {permissionSections && props.permissionPreset && Object.keys(props.permissionPreset).length!=0
              ?Object.keys(permissionSections[value]).map((section:string,index:number)=>{
                //console.log("Single section data",permissionSections, permissionSections[value],section)
                try{
                  //console.log("props.permissionPreset",props.permissionPreset)
                  const permissionSet = (documentSections.includes(value)?props.permissionPreset[value][section]:props.permissionPreset[section])
                  //console.log("sectionName", section, permissionSet);
                  return(
                    <div key={index}>
                      <p className="text-xl">{Object.keys(sectionNames)[Object.values(sectionNames).indexOf(section)]}</p>
                      {value=="documents"
                        ?Object.keys(permissionSet).map((subsection,subindex)=>{
                          return <div key={index+"_"+subindex}>
                            <p>{docSubTypes[subsection]}</p>
                            <RenderPermissions index={index+"_"+subindex} id={props.fieldData.id} sectionName={subsection} permissionSet={permissionSet[subsection]} setPermissionSet={props.setPermissionSet} category={section} disabled={props.disabled} multiple={props.fieldData.multiple} />
                            <br />
                          </div>
                        })
                        :<RenderPermissions index={index} id={props.fieldData.id} sectionName={section} permissionSet={permissionSet} setPermissionSet={props.setPermissionSet} category={value} disabled={props.disabled} multiple={props.fieldData.multiple} />}
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
  catch(e){
    return <p className="my-5 text-red-600">An error has occured</p>
  }
};


function RenderPermissions(props:{index:number|string, id:string, sectionName:string, category:string, permissionSet:any, setPermissionSet:Function,disabled?:boolean, multiple?:boolean}){
  const permissionTypes = ["access","view","add","edit","delete","select"];
  const documentSections = getDocSecList("shortname");
  
  return (
    <div>
      {permissionTypes.map(perm=>{
        if (perm=="select" && props.sectionName!="team")
          return ""
        return <Button key={props.index+perm}
          disableRipple={props.disabled} className={`${props.disabled?"hover:cursor-default	":""}`} disableFocusRipple={props.disabled}
          variant={props.permissionSet.includes(perm)?"contained":"outlined"} color="secondary"
          onClick={()=>{
            try{
              if (props.disabled)
                return;
              props.setPermissionSet((curr:any)=>{
                if (!curr) return;
                //console.log("curr[section].includes(perm)", curr, section, curr[section],/*  curr[section].includes(perm),curr[section].filter((name:string)=> name!=perm) */)
                let singleSectionPermission;
                if (props.multiple)
                  singleSectionPermission = documentSections.includes(props.category)
                    ?curr[props.index][props.id][props.category][props.sectionName]
                    :curr[props.index][props.id][props.sectionName]
                  
                else
                  singleSectionPermission = documentSections.includes(props.category)
                    ?curr[props.id][props.category][props.sectionName]
                    :curr[props.id][props.sectionName]

                if (singleSectionPermission.includes(perm)){
                  const num = singleSectionPermission.indexOf(perm);
                  singleSectionPermission.splice(num,1);
                }
                else
                  singleSectionPermission.push(perm);

                //console.log("curr",curr);
                if (props.multiple)
                  return [...curr];
                else
                  return {...curr};
              }) 
            }
            catch(e){console.log("err",e)}
          }} 
          sx={{borderRadius:20, marginRight:"7px"}}
        >
          {perm}
        </Button>
      })}
    </div>
  )
}

export default PermissionsField;
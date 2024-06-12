import { useEffect, useState, createElement, FormEventHandler } from "react";
//import PermissionSetter from "../BasicComponents/PermissionSetter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import moment from "moment";
import { Autocomplete, TextField as MUITextField } from "@mui/material";

function FieldLabel (props:{index:number|string, id:string, name:string, required:boolean, disabled:boolean}){
  return(
    <label 
      key={props.index+props.id+"1"} htmlFor={props.id} 
      className={`font-light text-lg ${props.disabled?"text-gray-700":""} ${props.name==""?"mx-5":""}`}
    >
      {props.name} {props.required?<span className="text-red-600">*</span>:""}
    </label>
  )
}

function TextField (props:{index:number|string, id:string, name: string, type: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, errorMessage?:string, repeatFields?:boolean, formIndex?:number }) {
  const [message, setMessage] = useState(<></>);

  useEffect(()=>{
    if (props.errorMessage)
      setMessage(<p className="mx-2 mt-1 text-red-600 text-sm">{props.errorMessage}.</p>);
  },[props.errorMessage]);
  
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} autoComplete="new-password" id={props.id} 
        type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full p-4  ${props.name==""?"mt-7":""} placeholder:text-slate-800`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]|| ""
        }
        
        onChange={props.repeatFields
          ?(e)=>{
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.id]=e.target.value; 
              return [...curr];})}
          :(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}
        }
      />
      {message}
    </div>
  )
};

function NumberField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  const [message, setMessage] = useState(<></>)
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} autoComplete="new-password" id={props.id} type="text"
        min={0.000001}
        disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]!==undefined?props.prefillValues[props.id]:""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            const val = e.target.value;
            if (isNaN(Number(val)))
              return;
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.id]=e.target.value; 
              return [...curr];
            })
          }
          :(e)=>{
            const val = e.target.value;
            let downsell_amount:number|"NO";
            if (isNaN(Number(val)))
              return;
              if (props.id=="SA"){
                if (!props.prefillValues["HA"])
                  downsell_amount = Number(val);
                else{
                  const num = Number(val)-Number(props.prefillValues["HA"]);
                  if (num<0)
                    setMessage(<p className="text-red-600 text-sm">This cannot be less than Hold Amount.</p>)
                  else{
                    setMessage(<></>);
                    downsell_amount=num;
                  }
                }
              }
            else if (props.id=="HA"){
              if (props.prefillValues["SA"]){
                const num = Number(props.prefillValues["SA"])-Number(val);
                if (num<0)
                  setMessage(<p className="text-red-600 text-sm">This cannot be greater than Sanctioned Amount.</p>)
                else{
                  setMessage(<></>);
                  downsell_amount=num;
                }
              }
            }
            props.setPrefillValues((curr:any)=>{
              curr[props.id]=val; 
              if (downsell_amount!=="NO")
                curr["DA"]=downsell_amount;
              return {...curr};
            })
          }
        }
      />
      {message}
    </div>
  )
};

function SelectField (props:{index:number|string, id:string, name: string, options: string[], required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number, sectionType?:string, setFileType?:Function, setCovType?:Function, setRole?:Function, setZone?:Function}){
  try{
    return(
      <div key={props.index} className="mb-5 mx-2">
        <FieldLabel key={props.index+"s_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
        <br/>
        <select key={props.index+props.id+"s_2"} id={props.id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          required={props.required} disabled={props.disabled}
          value={props.repeatFields
            ?Number(props.prefillValues[props.formIndex||0][props.id])||""
            :Number(props.prefillValues[props.id])|| ""
          }
          
          onChange={props.repeatFields && props.formIndex!=null
            ?(e)=>{
              props.setPrefillValues((curr:any)=>{
                curr[props.formIndex||0][props.id]=e.target.value;
                return [...curr];
              })}
            :(e)=>{
              const num = Number(e.target.value)
              props.setPrefillValues((curr:any)=>{curr[props.id]=num; return {...curr}})
              if (props.id=="T" && props.setFileType){
                props.setFileType(num);
                if (props.setCovType && props.sectionType=="cov")
                  props.setCovType(num);
              }
              else if (props.setRole && props.id=="R")
                props.setRole(num);
              
              else if (props.setZone && props.id=="Z")
                props.setZone(num);
            }
          }
        >
          <option key={props.index+"_0"} value={""} disabled>Select {props.name}</option>
          {props.options.map((option:any,optionIndex:any)=>{
            return <option key={props.index+"_"+optionIndex} value={optionIndex+1}>{option}</option>
          })}
        </select>
      </div>
    )
  } 
  catch(err){
    return <></>
  }
};

const getValidMinDate = (id:string, prefillValues:any ):string => {
  let date = moment(new Date()).format("yyyy-MM-DD");
  if (id!=="SD")
    date = prefillValues["SD"]
  return date;
}

function DateField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} id={props.id} type="date" 
        disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full p-4 text-black ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]?moment(props.prefillValues[props.id]).format("yyyy-MM-DD"):""}
        min={getValidMinDate(props.id, props.prefillValues)}
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return [...curr];})}
          :(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}
        }
      />
    </div>
  )
};

function TextAreaField (props:{index:number|string, id: string, name:string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}) {
  return (
    <div key={props.index}>
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}}
      />
    </div>
  )
};

function RoleField (props:{index:number, id: string, name:string, roleList:any, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}){

  const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
  const [currentRole, setCurrentRole] = useState(-1);

  useEffect(()=>{
    if (props.prefillValues["R"] && props.prefillValues["R"]!=currentRole)
      setCurrentRole(props.prefillValues["R"])
  },[props.prefillValues])

  useEffect(()=>{
    if (props.roleList==undefined)
      return;
    const obj:any={}
    for (let i=0; i<props.roleList.length; i++)
      obj[props.roleList[i]["N"]]=props.roleList[i]["P"];
    setAllRolesPermissionsList(obj);
  },[props.roleList])

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr["UP"]=allRolesPermissionsList[Object.keys(allRolesPermissionsList)[currentRole-1]];
      return {...curr};
    })
  },[allRolesPermissionsList,currentRole])

  return (
    <div>
      <SelectField index={props.index} id={"R"} name={"Role"} options={Object.keys(allRolesPermissionsList)} required={props.required} disabled={props.disabled} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} setRole={setCurrentRole} />
      {currentRole==-1
        ?<></>
        :<PermissionsField index={props.index} id={"P"} name={"Permission"} 
          permissionPreset={props.prefillValues["UP"]} 
          required={props.required} disabled={props.disabled} 
          setPermissionSet={props.setPrefillValues} 
        />
      }
    </div>
  )
};

function PermissionsField (props:{index:number, id: string, name:string, permissionPreset:any, required:boolean, disabled:boolean, setPermissionSet:Function, multiple?:boolean}){
  const [permissionTypes] = useState (["access", "view", "delete","add","edit"]);



  useEffect(()=>{
    if (props.multiple && props.permissionPreset.length==0)
      props.setPermissionSet((curr:any)=>{
        curr["UP"]=[{ "Loan Account":[], "Product": [], "Transaction Documents": [], "Compliance Documents": [], "Covenants": [] }];
        return {...curr};
      }
    );
    else if (props.permissionPreset && Object.keys(props.permissionPreset).length==0)
      props.setPermissionSet( (curr:any)=>{
        curr["UP"]={ "Loan Account":[], "Product": [], "Transaction Documents": [], "Compliance Documents": [], "Covenants": [] };
        //console.log("NEW CURR",curr)
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
        curr[props.index]["UP"][section] = [...permissions];
        return [...curr];
      })
    
    else
      props.setPermissionSet((curr:any)=>{
        curr["UP"][section] = [...permissions];
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

function ComboboxField (props:{index:number|string, id: string, name:string, suggestions:any, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, multiple?:boolean, singleValue?:boolean}){
  const [value, setValue] = useState("");
	const [results, setResults] = useState<any>([]);

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr[props.id]=results; 
      return {...curr};
    })
  },[results]);

  useEffect(()=>{
    if (props.prefillValues && props.prefillValues["RM"]){
      console.log("Combobox suggestions",props.suggestions);
      for (let i=0; i<props.suggestions.length; i++)
        if (props.suggestions[i].label==props.prefillValues["RM"])
          setValue(props.suggestions[i].label);
    }
  },[props.prefillValues]);


  return (
    <div key={props.index}>
      <FieldLabel index={props.index} id={props.id} name={""} required={false} disabled={props.disabled} />
      <Autocomplete key={props.index} id={props.id} disablePortal
        multiple={props.multiple}
        disabled={props.disabled}
        options={props.suggestions}

        onChange={(_,temp)=>{setResults(props.multiple?temp.map((val:any)=>val["values"]["E"]):temp["values"]["E"])}} 
        getOptionLabel={(option:any)=>option.label} 
        
        filterOptions={(optionsList)=>{
          if (value=="")
            return optionsList;

          const newOptionsList:any = []; 
          const regEx = new RegExp(value, "i");
          for (let i=0; i<optionsList.length; i++){
            let found = false;
            const values=Object.values(optionsList[i].values);
            for (let j=0; j<values.length; j++){
              //@ts-ignore
              if (values[j].search(regEx)!==-1) 
                found = true;
            }
            if (found)
              newOptionsList.push(optionsList[i]);
          }
          return newOptionsList;
        }}
        renderInput={(vals)=><MUITextField {...vals} value={value} onChange={(e)=>{setValue(e.target.value)}} label={<p>{props.name} {props.required?<span className="text-red-600">*</span>:""}</p>} placeholder={`Add ${props.name.toLowerCase()}${(props.multiple?"s":"")}`} />} 
        />
    </div>
  )
};

const MultiTextField = (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) => {
  return <Autocomplete multiple freeSolo options={[]} renderInput={(vals)=><MUITextField {...vals} label={<p>{props.name} {props.required?<span className="text-red-600">*</span>:""}</p>} placeholder={`Add ${props.name.toLowerCase()}s`} />} />
}

const CheckboxField = (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) => {
  return (
    <div className="flex flex-row">
      <input type="checkbox" className="mr-3" checked={(props.prefillValues && props.prefillValues[props.id]==true)||false} onChange={()=>{props.setPrefillValues((curr:any)=>{curr[props.id]=true; return {...curr}})}} />
      <p>{props.name}</p>
    </div>
  )
}

function FormRepeatableGrid(props:{fieldList:any, fieldValues:any, setFieldValues:Function, submitForm:FormEventHandler, fieldsInRow:number, preexistingValues?:boolean}) {
  const [currentForm, setCurrentForm] = useState(0);
  const [repeatForm, setRepeatForm] = useState<any>([]);
  const [renderRepeatForm, setRenderRepeatForm] = useState<any>([]);
  
  useEffect(()=>{
    if (props.preexistingValues){
      setCurrentForm(props.fieldValues.length-1);
      const arr =  (props.fieldValues.map((_:any,index:number)=>{
        return { key:"f"+index, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:index, repeatFields:true }
      }));
      setRepeatForm(arr);
    }
    else {
      setRepeatForm ([{ key:"f0", grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm, repeatFields:true }]);
      props.setFieldValues([{}])
    }
  },[props.preexistingValues]);

  useEffect(()=>{
    setRenderRepeatForm((curr:any)=>{
      curr = repeatForm.map((form:any)=>{
        form.fieldValues= props.fieldValues;
        return createElement(RenderForm, form);
      });
      return curr;
    })
  },[props.fieldValues,repeatForm]);
  
  return (
    <div className="">
      <br/>
      <div>
        {renderRepeatForm.map((grid:any,index:number)=>{
          const fieldsInRow =props.fieldsInRow==2?`grid grid-cols-2`:`grid grid-cols-3`;
          return <div key={index} className={fieldsInRow}>{grid}</div>;
        })}
      </div>
      <div>
        {repeatForm.length>1 
          ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button"
            onClick={()=>{
              setCurrentForm(curr=>{return curr-1});
              setRepeatForm((curr:any)=>{return curr.slice(0,-1);})
            }}
          >-</button>
          :""
        }
        <button className="mt-10 h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button"
          onClick={()=>{
            setCurrentForm(curr=> {return curr+1});
            props.setFieldValues((curr:any)=>{ curr=[...curr,{}]; return curr})
            setRepeatForm((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm+1, repeatFields:true }]}); 
          }}
        >+</button>
      </div>
      <br/>
    </div>
  )
}

function RenderForm(props:{grid:any, fieldValues:any, setter:Function, formIndex:number, repeatFields:boolean}) {
  return props.grid.map((item:any,index:number)=>{
    if (item.type=="select")
      return <SelectField id={item.id} key={index} index={index} name={item.name} options={item.options} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="number")
      return <NumberField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="date")
      return <DateField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else
      return <TextField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} type={item.type} repeatFields={props.repeatFields} formIndex={props.formIndex} /> 
  })
}


export { 
  TextField, NumberField, DateField, SelectField, TextAreaField, 
  RoleField, PermissionsField, ComboboxField, 
  MultiTextField, CheckboxField, 
  FormRepeatableGrid 
};
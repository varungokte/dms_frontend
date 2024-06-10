import { useEffect, useState, createElement, FormEventHandler } from "react";
import PermissionSetter from "../BasicComponents/PermissionSetter";
import moment from "moment";
import { Autocomplete, TextField as MUITextField } from "@mui/material";

function FieldLabel (props:{index:number|string, id:string, name:string, required:boolean}){
  return(
    <label key={props.index+props.id+"1"} htmlFor={props.id} className={`font-light text-lg ${props.name==""?"mx-5":""}`}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
  )
}

function TextField (props:{index:number|string, id:string, name: string, type: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} 
        type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full p-4  ${props.name==""?"mt-7":""} placeholder:text-slate-800`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]|| ""
        }
        
        onChange={props.repeatFields
          ?(e)=>{props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return [...curr];})}
          :(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}
        }
      />
    </div>
  )
};

function NumberField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} type="number"
        placeholder="0"
        min={0}
        disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full h-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]|| ""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return [...curr];})}
          :(e)=>{
            props.setPrefillValues((curr:any)=>{
              if (props.id=="HA" && curr["SA"] && Number(e.target.value)>Number(curr["SA"]))
                return {...curr}
              curr[props.id]=e.target.value; 
              if ((props.id=="SA" || props.id=="HA") && (curr["HA"] && curr["SA"]))
                curr["DA"] = Number(curr["SA"])-Number(curr["HA"]);
              return {...curr};
            })
          }
        }
      />
    </div>
  )
};

function SelectField (props:{index:number|string, id:string, name: string, options: string[], required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number, sectionType?:string, setFileType?:Function, setCovType?:Function, setRole?:Function, setZone?:Function}){
  try{
    return(
      <div key={props.index} className="mb-5 mx-2">
        <FieldLabel key={props.index+"s_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
        <br/>
        <select key={props.index+props.id+"s_2"} id={props.id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          required={props.required} disabled={props.disabled}
          value={props.repeatFields
            ?Number(props.prefillValues[props.formIndex||0][props.id])||-1
            :Number(props.prefillValues[props.id])|| -1
          }
          
          onChange={props.repeatFields && props.formIndex!=null
            ?(e)=>{props.setPrefillValues((curr:any)=>{console.log("OLD CURR",curr); curr[props.formIndex||0][props.id]=e.target.value; console.log("NEW CURR",curr); return [...curr];})}
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
          <option key={props.index+"_0"} value={-1} >Select {props.name}</option>
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


function DateField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} type="date" 
        disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full h-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]?moment(props.prefillValues[props.id]).format("yyyy-MM-DD"):""}
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
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}}
      />
    </div>
  )
};

function RoleField (props:{index:number|string, id: string, name:string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}){

  const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
  const [currentRole, setCurrentRole] = useState(-1);

  useEffect(()=>{
    setAllRolesPermissionsList({
      "Maker":{
        "Loan Account": ["access","add","edit"],
        "Product": ["access", "view", "delete"],
        "Transaction Documents": ["access", "delete","add","edit"],
        "Compliance Documents": ["edit"],
        "Covenants": ["access", "view", "delete","add","edit"],
      },
      "Checker":{
        "Loan Account": ["access", "view", "delete","add","edit"],
        "Product": ["access", "view", "delete","add","edit"],
        "Transaction Documents": ["access", "view", "delete","add","edit"],
        "Compliance Documents": ["access", "view", "delete","add","edit"],
        "Covenants": ["access", "view", "delete","add","edit"],
      }
    })
  },[]);

  return (
    <div>
      <SelectField index={props.index} id={"R"} name={"Role"} options={Object.keys(allRolesPermissionsList)} required={props.required} disabled={props.disabled} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} setRole={setCurrentRole} />
      {currentRole==-1
        ?<></>
        :<PermissionsField index={props.index} id={"P"} name={"Permission"} 
          permissionPreset={allRolesPermissionsList[Object.keys(allRolesPermissionsList)[currentRole-1]]} 
          required={props.required} disabled={props.disabled} 
          prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
        />
      }
    </div>
  )
};

function PermissionsField (props:{index:number|string, id: string, name:string, permissionPreset:any, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}){
  const [permissionSet, setPermissionSet] = useState<any>([]);
  
  useEffect(()=>{
    setPermissionSet(props.permissionPreset);
  },[props.permissionPreset]);

  useEffect(()=>{
    props.setPrefillValues(((curr:any)=>{
      curr["UP"] = permissionSet;
      return {...curr};
    }))
  },[permissionSet]);

  return (
    <div key={props.index}>
      <FieldLabel index={props.index} id={props.id} name={props.name} required={props.required} />
      <PermissionSetter setter={setPermissionSet} permissionSet={permissionSet} />
    </div>
  )
};

function ComboboxField (props:{index:number|string, id: string, name:string, suggestions:any, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, multiple?:boolean}){
  const [value, setValue] = useState("");
	const [results, setResults] = useState<any>([]);
  useEffect(()=>{
    console.log("result",results)
    props.setPrefillValues((curr:any)=>{
      curr[props.id]=results; 
      return {...curr};
    })
  },[results])

  return (
    <div key={props.index}>
      <FieldLabel index={props.index} id={props.id} name={""} required={false} />
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
      <input type="checkbox" className="mr-3" onChange={()=>{props.setPrefillValues((curr:any)=>{curr[props.id]=true; return {...curr}})}} />
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
            props.setFieldValues((curr:any)=>{ console.log(curr); curr=[...curr,{}]; return curr})
            setRepeatForm((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm+1, repeatFields:true }]}); 
          }}
        >+</button>
      </div>
      <br/>
    </div>
  )
}

function RenderForm(props:{grid:any, fieldValues:any, setter:Function, formIndex:number, repeatFields:boolean}) {
  useEffect(()=>{
    console.log("render form field Valies",props.fieldValues)
  },[props.fieldValues])
  return props.grid.map((item:any,index:number)=>{
    return item.type=="select"
      ?<span className="mx-5">
        <SelectField id={item.id} key={index} index={index} name={item.name} options={item.options} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
      </span>
      :<span className="mx-5">
        <TextField id={item.id} key={index} index={index} name={item.name} disabled={false}  prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} type={item.type} repeatFields={props.repeatFields} formIndex={props.formIndex} />
      </span> 
  })
}


export { TextField, NumberField, SelectField, DateField, TextAreaField, RoleField, PermissionsField, ComboboxField, MultiTextField, CheckboxField, FormRepeatableGrid };
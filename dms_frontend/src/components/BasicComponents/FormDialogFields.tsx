import { useEffect, useState } from "react";
import PermissionSetter from "./PermissionSetter";

function FieldLabel (props:{index:number, id:string, name:string, required:boolean}){
  return(
    <label key={props.index+props.id+"1"} htmlFor={props.id} className="font-light text-lg">{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
  )
}

function TextField (props:{index:number, id:string, name: string, type: string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} 
        type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full h-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]|| ""}
        onChange={props.repeatFields && props.formIndex
          ?(e)=>{
            props.setter((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return curr;})
            props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return {...curr};})
          }
          :(e)=>{
            props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
            props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
          }
        }  
      />
    </div>
  )
};

function SelectField (props:{index:number, id:string, name: string, options: string[], required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function, setFileType?:Function, setCovType?:Function, sectionType?:string, repeatFields?:boolean, formIndex?:number}){
  try{
    return(
      <div key={props.index} className="mb-5">
        <FieldLabel key={props.index+"s_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
        <br/>
        <select key={props.index+props.id+"s_2"} id={props.id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          required={props.required} disabled={props.disabled}
          value={Number(props.prefillValues[props.id])?Number(props.prefillValues[props.id])-1:-1}
          onChange={props.repeatFields && props.formIndex
            ?(e)=>{
              props.setter((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return curr;})
              props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return {...curr};})
            }
            :(e)=>{
              const num = Number(e.target.value)+1
              props.setter((curr:any)=>{curr[props.id]=num; return {...curr}})
              props.setPrefillValues((curr:any)=>{curr[props.id]=num; return {...curr}})
              if (props.setFileType && props.id=="T"){
                props.setFileType(num);
                if (props.setCovType && props.sectionType=="cov")
                  props.setCovType(num);
              }
            }
          }
        >
          <option key={props.index+"_0"} value={-1} >Select {props.name}</option>
          {props.options.map((option:any,optionIndex:any)=>{
            return <option key={props.index+"_"+optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  } 
  catch(err){
    return <></>
  }
};

function TextAreaField (props:{index:number, id: string, name:string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}) {
  return (
    <div key={props.index}>
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.id} name={props.name} required={props.required} />
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{
          props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
          props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
        }}
      />
    </div>
  )
};

function RoleField (props:{index:number, id: string, name:string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}){
  /* useEffect(()=>{
    if (!props.suggestionsFunction)
      return;
    props.suggestionsFunction().then((res:any)=>{
      if (res.U)
        setOptionsList(res.U);
      if (res.R){
        setRolesList(res.R.map((role:any)=>{return role.N}));
        setPermissionList(res.R.map((role:any)=>{return JSON.parse(role.P)}))
      }
    })
  },[]); */

  const [allPermissionsList, setAllPermissionsList] = useState<any>({});
  const [singleRolePermission, setSingleRolePermission] = useState<any>({});

  useEffect(()=>{
    //call function to get role list
    console.log(singleRolePermission)
    setAllPermissionsList(
      {"Maker":
        {
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

  useEffect(()=>{
    console.log("here are the prefill values,",props.prefillValues);
    setSingleRolePermission(allPermissionsList[Object.keys(allPermissionsList)[Number(props.prefillValues["R"])-1]]);
    //console.log("complete permission set", Number(props.prefillValues["R"]), Object.keys(permissionMapping), permissionMapping[Object.keys(permissionMapping)[Number(props.prefillValues["R"])-1]]);
  },[props.prefillValues]);


  useEffect(()=>{
    console.log("props in role field", props);
  },[props])

  return (
    <div>
      <SelectField index={props.index} id={"R"} name={"Role"} options={Object.keys(allPermissionsList)} required={props.required} disabled={props.disabled} setter={props.setter} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} />
      <PermissionsField index={props.index} id={"P"} name={"Permission"} permissionPreset={allPermissionsList} required={props.required} disabled={props.disabled} setter={props.setter} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} />
    </div>
  )
};

function PermissionsField (props:{index:number, id: string, name:string, permissionPreset:any, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}){
  const [permissionSet, setPermissionSet] = useState<any>();
  
  useEffect(()=>{
    setPermissionSet(props.permissionPreset);
  },[props.permissionPreset]);

  return (
    <div key={props.index}>
      <FieldLabel index={props.index} id={props.id} name={props.name} required={props.required} />
      <PermissionSetter newRole={true} setter={props.setter} setPrefillValues={props.setPrefillValues} permissionSet={permissionSet} />
    </div>
  )
};

function ComboboxField (props:{index:number, id: string, name:string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}){
  return (
    <div key={props.index}></div>
  )
  /* const [obj, setObj] = useState({});  
  useEffect(()=>{
    console.log("OBJ", obj)
    props.repeatFields
      ?props.setter((curr:any)=>{curr[props.formIndex][id]=obj; return curr;})
      :props.setter((curr:any)=>{curr[id]=obj; return curr})
  },[obj]);

  return(
    <div key={index+id+"c_0"} className="mb-5">
      <label key={index+id+"c_1"} htmlFor={id} className="font-light text-lg">{name}</label>
      <Combobox 
        type="double"
        searchFields={["N","E"]}
        optionsList={optionsList.map(user=>{return {values: user, label:`${user["N"]}<${user["E"]}>`}})} 
        label="User" 
        value={obj}
        setValue={setObj}
      />
    </div>
  ) */
}


export { TextField, SelectField, TextAreaField, RoleField, PermissionsField, ComboboxField };
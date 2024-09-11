import { useEffect, useState } from "react";

import { DocumentSectionTypes } from "@/types/DataTypes";
import { FormFieldProps } from "@/types/FormComponentProps";

import FieldLabel from "./FieldLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select/Select";


function SelectField(props:FormFieldProps & {repeatFields?:boolean, formIndex?:number, sectionType?:DocumentSectionTypes, setFileType?:Function, setCovType?:Function, setOldZone?:Function}){
  //useEffect(()=>console.log(props),[props]);
  const [value, setValue] = useState("");
  const [error, setError] = useState(props.error);

  useEffect(()=>{
    setValue(props.fieldValue);
  },[props.fieldValue]);

  useEffect(()=>setError(props.error),[props.error]);
    return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"s_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <br/>
      <Select key={props.index+props.fieldData.id+"s_3"+value}  error={error}
        color="secondary"
        id={props.fieldData.id} className={`bg-white w-full`}
        required={props.fieldData.required} disabled={props.disabled}

        sx={props.readonly?{"& .MuiOutlinedInput-input.Mui-disabled":{WebkitTextFillColor:"black"}}:{}}

        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}

        defaultValue={value || ""}
        
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            setError(false);
            props.setFieldValues((curr:any)=>{
              curr[props.formIndex||0][props.fieldData.id]=e.target.value;
              return [...curr];
            })
          }
          :(e)=>{
            setError(false);
            const val = e.target.value;
            props.setFieldValues((curr:any)=>{curr[props.fieldData.id]=val; return {...curr}});
            if (props.setCovType && props.sectionType=="covenant" && props.fieldData.id=="T")
              props.setCovType(val);
            else if (props.setOldZone && props.fieldData.id=="Z")
              props.setOldZone(props.fieldValue);
          }
        }
      >
        <MenuItem  key={props.index+"_0"} value={""} disabled><em>Select {props.fieldData.name}</em></MenuItem>
        {(props.fieldData.options||[]).map((option:any,optionIndex:any)=>{
          if (optionIndex!=0)
            return <MenuItem key={props.index+"_"+optionIndex} value={option}>{option}</MenuItem>
        })}
      </Select>
          
    </div>
  )
};

export default SelectField;
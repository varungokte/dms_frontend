import { useEffect, useState } from "react";
import { FormFieldProps } from "@/types/FormComponentProps";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import FieldLabel from "./FieldLabel";

function RadioGroupField(props:FormFieldProps & {makeVertical?:boolean}){
  const [value,setValue] = useState("Fixed");
  
  useEffect(()=>{
    setValue(props.fieldValue)
  },[props]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <br />
      <RadioGroup key={props.index}  id={props.fieldData.id}
        className="py-2 px-10"
        
        row={!props.makeVertical} 
        
        value={value||(props.fieldData.options||["",""])[1]}
        onChange={(e)=>{
          props.setFieldValues((curr:any)=>{
            curr[props.fieldData.id]=e.target.value;
            return {...curr};
          })
        }}
      >
        {(props.fieldData.options||[]).map((option,index)=>{
          if (option!=="-")
            return <FormControlLabel key={props.index+"_"+index} id={props.fieldData.id+index} value={option} color="secondary" control={<Radio />} label={option} disabled={props.disabled} sx={props.readonly?{"& .Mui-disabled":{backgroundColor:"red",color:"blue"}}:{}} />
        })}
      </RadioGroup>
    </div>
  )
}

export default RadioGroupField;
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldAttributes } from "@/types/FormAttributes";
import FieldLabel from "./FieldLabel";
import { useEffect, useState } from "react";

function RadioGroupField(props:{index:number, fieldData:FormFieldAttributes, prefillValues:FieldValues, setPrefillValues:Function, disabled:boolean, readonly?:boolean, makeVertical?:boolean}){
  const [value,setValue] = useState("Fixed");
  
  useEffect(()=>{
    setValue(props.prefillValues[props.fieldData.id])
  },[props]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <br />
      <RadioGroup key={props.index} 
        className="py-2 px-10"
        
        row={!props.makeVertical} 
        
        value={value||(props.fieldData.options||["",""])[1]}
        onChange={(e)=>{
          props.setPrefillValues((curr:any)=>{
            curr[props.fieldData.id]=e.target.value;
            return {...curr};
          })
        }}
      >
        {(props.fieldData.options||[]).map((option,index)=>{
          if (option!=="-")
            return <FormControlLabel key={props.index+"_"+index} value={option} color="secondary" control={<Radio />} label={option} disabled={props.disabled} sx={props.readonly?{"& .Mui-disabled":{backgroundColor:"red",color:"blue"}}:{}} />
        })}
      </RadioGroup>
    </div>
  )
}

export default RadioGroupField;
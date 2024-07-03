import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldValues } from "DataTypes";
import FieldLabel from "./FieldLabel";
import { useEffect, useState } from "react";

function RadioGroupField(props:{index:number, id:string, name:string, options:string[]|readonly string[], prefillValues:FieldValues, setPrefillValues:Function, required?:boolean, disabled?:boolean, makeVertical?:boolean}){
  const [value,setValue] = useState("Fixed");
  
  useEffect(()=>{
    setValue(props.prefillValues[props.id])
  },[props]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <br />
      <RadioGroup key={props.index} row={!props.makeVertical} className="py-2 px-10"
        value={value||props.options[1]}
        onChange={(e)=>{
          props.setPrefillValues((curr:any)=>{
            curr[props.id]=e.target.value;
            return {...curr};
          })
        }}
      >
        {props.options.map((option,index)=>{
          if (option!=="-")
            return <FormControlLabel key={props.index+"_"+index} value={option} control={<Radio />} label={option} disabled={props.disabled} />
        })}
      </RadioGroup>
    </div>
  )
}

export default RadioGroupField;
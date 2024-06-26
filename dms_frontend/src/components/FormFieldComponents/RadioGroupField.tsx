import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FieldValues } from "DataTypes";
import FieldLabel from "./FieldLabel";

function RadioGroupField(props:{index:number, id:string, name:string, options:string[]|readonly string[], prefillValues:FieldValues, setPrefillValues:Function, required?:boolean, disabled?:boolean, makeVertical?:boolean}){
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.id} name={props.name} required={props.required} />
      <RadioGroup key={props.index} row={!props.makeVertical} className="my-2 mx-10"
        onChange={(e)=>{
          console.log("New value",e.target.value); 
          props.setPrefillValues((curr:any)=>{
            curr[props.id]=e.target.value;
            return {...curr};
          })
        }}
      >
        {props.options.map((option,index)=>{
          if (option!=="-")
            return <FormControlLabel key={props.index+"_"+index} value={option} control={<Radio />} label={option} />
        })}
      </RadioGroup>
    </div>
  )
}

export default RadioGroupField;
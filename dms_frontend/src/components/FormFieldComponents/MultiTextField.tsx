import { Autocomplete, TextField as MUITextField } from "@mui/material";
import { FieldValues } from "DataTypes";
import { useEffect, useState } from "react";

const MultiTextField = (props:{index:number, id:string, name: string, required?:boolean, disabled?:boolean, prefillValues:FieldValues, setPrefillValues:Function}) => {
  const [results,setResults] = useState<string[]>([]);

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr[props.id]=results;
      return {...curr};
    })
  },[results])

  
  return (
    <Autocomplete 
      disabled={props.disabled}
      multiple 
      freeSolo
      options={[]}
      onChange={(_,temp)=>{
        setResults(temp);
      }}
      renderInput={
        (vals)=><MUITextField 
          {...vals} 
          label={<p>{props.name}{props.required?<span className="text-red-600">*</span>:""}</p>} 
          placeholder={`Add ${props.name.toLowerCase()}`} 
        />} 
    />
  )
}

export default MultiTextField;
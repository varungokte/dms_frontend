import { Autocomplete, TextField as MUITextField } from "@mui/material";
import { FieldValues, FormFieldAttributes } from "DataTypes";
import { useEffect, useState } from "react";

const MultiTextField = (props:{index:number, fieldData:FormFieldAttributes, prefillValues:FieldValues, setPrefillValues:Function, disabled:boolean}) => {
  const [results,setResults] = useState<string[]>([]);

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr[props.fieldData.id]=results;
      return {...curr};
    })
  },[results])

  return (
    <div className="mb-5 mx-2">
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
          label={<p>{props.fieldData.name}{props.fieldData.required?<span className="text-red-600">*</span>:""}</p>} 
          placeholder={`Add ${props.fieldData.name.toLowerCase()}`} 
        />
      } 
    />
    </div>
  )
}

export default MultiTextField;
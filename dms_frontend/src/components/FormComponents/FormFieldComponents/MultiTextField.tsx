import { Autocomplete, TextField as MUITextField } from "@mui/material";

const MultiTextField = (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) => {
  return (
    <Autocomplete 
      multiple 
      freeSolo 
      options={[]} 
      renderInput={
        (vals)=><MUITextField 
          {...vals} 
          label={<p>{props.name} 
          {props.required?<span className="text-red-600">*</span>:""}</p>} 
          placeholder={`Add ${props.name.toLowerCase()}s`} 
        />} 
    />
  )
}

export default MultiTextField;
import { useEffect, useState } from "react";
import { Autocomplete, TextField as MUITextField } from "@mui/material";
import FieldLabel from "./FieldLabel";

function ComboboxField (props:{index:number|string, id: string, name:string, suggestions:any, required?:boolean, disabled?:boolean, prefillValue:any, setPrefillValues:Function, multiple?:boolean, edit?:boolean}){
  const [value, setValue] = useState("");
	const [results, setResults] = useState<any>([]);
  const [defaultValue,setDefaultValue] = useState<any>();

  const [parameterToBeSent] = useState("E"); //Later this will be a prop

  //useEffect(()=>console.log("combobox prefill values",props.prefillValue),[props.prefillValue])

  useEffect(()=>{
    if (props.prefillValue && props.suggestions.length!=0){
      let values=[];
      for (let i=0 ; i<props.suggestions.length; i++){
        if (props.multiple && props.prefillValue.includes(props.suggestions[i].values["E"]))
          values.push(props.suggestions[i])
        else if (props.suggestions[i].values["E"]==props.prefillValue)
          setDefaultValue(props.suggestions[i])
      }
      if (props.multiple && values.length!=0)
        setDefaultValue(values)
    }
    else  
      setDefaultValue(undefined);
  },[props.prefillValue,props.suggestions])

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr[props.id]=results; 
      return {...curr};
    })
  },[results]);

  useEffect(()=>{
    if (!props.prefillValue)
      return;
    for (let i=0; i<props.suggestions.length; i++)
      if (props.suggestions[i].label==props.prefillValue)
        setValue(props.suggestions[i].label);
  },[props.prefillValue]);

  return (
    <div key={props.index}>
      <FieldLabel index={props.index} id={props.id} name={""} required={false} disabled={props.disabled || false} />
      <Autocomplete key={props.index+defaultValue} id={props.id} disablePortal
        multiple={props.multiple}
        disabled={props.disabled}
        limitTags={1}
        //value={(props.edit && !props.multiple)?(defaultValue||null):(defaultValue||undefined)}
        
        defaultValue={props.multiple
          ?defaultValue 
          :defaultValue
        }

        options={props.suggestions}
        getOptionLabel={(option:any)=>option.label}

        onChange={(_,temp)=>{
          setResults(temp);
          if (!props.multiple)
            setDefaultValue(results[0])
        }} 
   
        isOptionEqualToValue={(option,value)=> option.values[parameterToBeSent]==value.values[parameterToBeSent]}
        
        filterOptions={(optionsList)=>{
          if (value=="")
            return optionsList;
          const regEx = new RegExp(value, "i");
          const newOptionsList:any = []; 
          for (let i=0; i<optionsList.length; i++){
            let found = false;
            const values=optionsList[i].values;
            
            if (values["E"].search(regEx)!==-1)
              found = true;
            else if (values["N"] && values["N"].search(regEx)!==-1)
              found=true;

            if (found)
              newOptionsList.push(optionsList[i]);
          }
          return newOptionsList;
        }}
        renderInput={(vals)=><MUITextField {...vals} value={value} onChange={(e)=>setValue(e.target.value)} label={<p>{props.name} {props.required?<span className="text-red-600">*</span>:""}</p>} placeholder={`Add ${props.name.toLowerCase()}${(props.multiple?"s":"")}`} />} 
        />
    </div>
  )
};

export default ComboboxField
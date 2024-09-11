import { useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";
import { TextField as MUITextField } from "@mui/material";
import { FormFieldProps } from "@/types/FormComponentProps";

function TextField(props:FormFieldProps & {size:"small"|"medium", padding?:number, errorMessage?:string, repeatFields?:boolean, formIndex?:number}) {
  try{
    const [message, setMessage] = useState(<></>);

    const [error,setError] = useState(props.error);

    useEffect(()=>{
      if (props.errorMessage)
        setMessage(<p className="mx-2 mt-1 text-red-600 text-sm">{props.errorMessage}.</p>);
    },[props.errorMessage]);
    
    useEffect(()=>setError(props.error),[props.error]);
    
    return(
      <div key={props.index} className="mb-5 mx-2">
        <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <br />
        <MUITextField key={props.index+props.fieldData.id+"t_2"} autoComplete="new-password" id={props.fieldData.id} error={error}
          size={props.size} color="secondary"
          type={props.fieldData.type} disabled={props.disabled} required={props.fieldData.required}
          className={`bg-white w-[100%] ${props.fieldData.name==""?"mt-7":""}`}
          sx={props.readonly?{"& .MuiOutlinedInput-input.Mui-disabled":{WebkitTextFillColor:"black"}}:{}}
          value={props.fieldValue || ""}
          
          onChange={props.repeatFields
            ?(e)=>{
              setError(false);
              props.setFieldValues((curr:any)=>{
                curr[props.formIndex||0][props.fieldData.id]=e.target.value; 
                return [...curr];})}
            :(e)=>{
              setError(false);
              props.setFieldValues((curr:any)=>{
                curr[props.fieldData.id]=e.target.value; 
                return {...curr};
              })
            }
          }
        />
        <br />
        {message}
      </div>
    )
  }
  catch(e){
    return <></>
  }

};

export default TextField;
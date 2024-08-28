import { useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldAttributes } from "@/types/FormAttributes";
import { TextField as MUITextField } from "@mui/material";

function TextField (props:{index:number|string, size:"small"|"medium", fieldData:FormFieldAttributes, prefillValues:FieldValues, setPrefillValues:Function, padding?:number, error?:boolean, errorMessage?:string, repeatFields?:boolean, formIndex?:number, readonly?:boolean, disabled:boolean,}) {
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
          value={props.repeatFields && props.formIndex!=undefined
            ?props.prefillValues[props.formIndex] && props.prefillValues[props.formIndex][props.fieldData.id]
              ?props.prefillValues[props.formIndex][props.fieldData.id]
              :""
            :props.prefillValues[props.fieldData.id]|| ""
          }
          
          onChange={props.repeatFields
            ?(e)=>{
              setError(false);
              props.setPrefillValues((curr:any)=>{
                curr[props.formIndex||0][props.fieldData.id]=e.target.value; 
                return [...curr];})}
            :(e)=>{
              setError(false);
              props.setPrefillValues((curr:any)=>{
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



        {/* <input key={props.index+props.fieldData.id+"t_2"} autoComplete="new-password" id={props.fieldData.id} readOnly={props.readonly}
          type={props.fieldData.type} disabled={props.disabled} required={props.fieldData.required}
          className={`border rounded-if w-full ${sizes[props.size]} ${props.fieldData.name==""?"mt-7":""} placeholder:text-slate-800`}
          value={props.repeatFields && props.formIndex!=undefined
            ?props.prefillValues[props.formIndex] && props.prefillValues[props.formIndex][props.fieldData.id]
              ?props.prefillValues[props.formIndex][props.fieldData.id]
              :""
            :props.prefillValues[props.fieldData.id]|| ""
          }
          
          onChange={props.repeatFields
            ?(e)=>{
              props.setPrefillValues((curr:any)=>{
                curr[props.formIndex||0][props.fieldData.id]=e.target.value; 
                return [...curr];})}
            :(e)=>{
              props.setPrefillValues((curr:any)=>{
                curr[props.fieldData.id]=e.target.value; 
                return {...curr};
              })
            }
          }
        /> */}
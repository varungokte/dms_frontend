import { FormFieldAttributes } from "DataTypes";
import FieldLabel from "./FieldLabel";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

function FloatNumberField(props:{index:number|string, fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, className?:string, error?:boolean, repeatFields?:boolean, formIndex?:number, disabled:boolean }){ 
  const [error, setError] = useState(props.error);
  
  useEffect(()=>setError(props.error),[props.error]);
  
  return (
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <TextField id={props.fieldData.id} name={props.fieldData.name} type="number" error={error}
        size="medium" color="secondary"
        className={props.className || `border rounded-if w-full p-3 ${props.fieldData.name==""?"mt-7":""}`}
        required={props.fieldData.required} disabled={props.disabled} 
        value={props.repeatFields && props.formIndex!=undefined
          ?props.prefillValues[props.formIndex]&&props.prefillValues[props.formIndex||0][props.fieldData.id]
            ?Number(props.prefillValues[props.formIndex||0][props.fieldData.id])
            :""
          :props.prefillValues[props.fieldData.id]?Number(props.prefillValues[props.fieldData.id]):""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?e=>{
            setError(false);
            if (!isNaN(Number(e.target.value))){
              props.setPrefillValues((curr:any)=>{
                curr[props.formIndex||0][props.fieldData.id] = Number(e.target.value);
                return [...curr];
              })
            }
          }
          :e=>{
            setError(false);
            if (!isNaN(Number(e.target.value))){
              props.setPrefillValues((curr:any)=>{
                curr[props.fieldData.id] = Number(e.target.value);
                return {...curr};
              })
            }
          }
        } 
      />
    </div>
  )
}

export default FloatNumberField;
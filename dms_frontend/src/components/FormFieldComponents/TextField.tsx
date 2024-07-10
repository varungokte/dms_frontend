import { useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";

function TextField (props:{index:number|string, id:string, name: string, type: string, required?:boolean, disabled?:boolean, prefillValues:any, setPrefillValues:Function, errorMessage?:string, repeatFields?:boolean, formIndex?:number }) {
  const [message, setMessage] = useState(<></>);

  useEffect(()=>{
    if (props.errorMessage)
      setMessage(<p className="mx-2 mt-1 text-red-600 text-sm">{props.errorMessage}.</p>);
  },[props.errorMessage]);
  
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} autoComplete="new-password" id={props.id} 
        type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full p-4  ${props.name==""?"mt-7":""} placeholder:text-slate-800`}
        value={props.repeatFields && props.formIndex!=undefined
          ?props.prefillValues[props.formIndex] && props.prefillValues[props.formIndex][props.id]
            ?props.prefillValues[props.formIndex][props.id]
            :""
          :props.prefillValues[props.id]|| ""
        }
        
        onChange={props.repeatFields
          ?(e)=>{
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.id]=e.target.value; 
              return [...curr];})}
          :(e)=>{
            props.setPrefillValues((curr:any)=>{
              curr[props.id]=e.target.value; 
              return {...curr};
            })
          }
        }
      />
      {message}
    </div>
  )
};

export default TextField;
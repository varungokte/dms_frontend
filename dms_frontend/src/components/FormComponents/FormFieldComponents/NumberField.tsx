import { useState } from "react";
import FieldLabel from "./FieldLabel";
import { FieldValues } from "DataTypes";

const validateDownsellAmount = (value:number, id:string, prefillValues:FieldValues, setMessage:Function) => {
  let downsell_amount:number|"NO"="NO";
  if (id=="SA"){
    if (!prefillValues["HA"])
      downsell_amount = value;
    else{
      const num = value-Number(prefillValues["HA"]);
      if (num<0)
        setMessage(<p className="text-red-600 text-sm">This cannot be less than Hold Amount.</p>)
      else{
        setMessage(<></>);
        downsell_amount=num;
      }
    }
  }
  else if (id=="HA"){
    if (prefillValues["SA"]){
      const num = Number(prefillValues["SA"])-value;
      if (num<0)
        setMessage(<p className="text-red-600 text-sm">This cannot be greater than Sanctioned Amount.</p>)
      else{
        setMessage(<></>);
        downsell_amount=num;
      }
    }
  }

  return downsell_amount;
}



function NumberField (props:{index:number|string, id:string, name: string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  const [message, setMessage] = useState(<></>)
  
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} autoComplete="new-password" 
        id={props.id} 
        type="text"
        min={0.000001}
        disabled={props.disabled} 
        required={props.required}
        className={`border rounded-if w-full p-4 ${props.name==""?"mt-7":""}`}
        value={props.repeatFields
          ?props.prefillValues[props.formIndex||0][props.id]||""
          :props.prefillValues[props.id]!==undefined?props.prefillValues[props.id]:""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            const val = e.target.value;
            if (isNaN(Number(val)))
              return;
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.id]=e.target.value; 
              return [...curr];
            })
          }
          :(e)=>{
            const val = e.target.value;
            if (isNaN(Number(val)))
              return;
            
              const downsell_amount = validateDownsellAmount(Number(val),props.id,props.prefillValues,setMessage);
            
            props.setPrefillValues((curr:any)=>{
              curr[props.id]=val; 
              if (downsell_amount!=="NO")
                curr["DA"]=downsell_amount;
              return {...curr};
            })
          }
        }
      />
      {message}
    </div>
  )
};

export default NumberField;
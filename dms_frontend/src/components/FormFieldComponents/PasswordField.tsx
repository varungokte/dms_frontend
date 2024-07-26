import { useState } from "react";
import FieldLabel from "./FieldLabel";
import eye from "./../static/eye.svg";
import eye_slash from "./../static/eye-slash.svg";
import { FormFieldAttributes } from "DataTypes";

function PasswordField(props:{index:number|string, fieldData:FormFieldAttributes, size:"small"|"large", prefillValues:any, setPrefillValues:Function, disabled:boolean}){
  const [showPassword, setShowPassword] = useState(false);

  const sizes = {
    large:{
      icon:"pt-2 w-[32px]",
      field:"py-6 pl-[45px]"
    },
    small:{
      icon:"pt-1 w-[27px]",
      field:"py-4 pl-[45px]"
    }
  }
  
  try{
    return(
      <div key={props.index} className="mb-5 mx-2">
        <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <div className="w-[100%] flex rounded bg-red-900" style={{backgroundColor:"white", height:"30px"}}>
          <img className={`absolute float-right ml-[5px] ${sizes[props.size].icon}` } src={showPassword?eye:eye_slash} onClick={()=>setShowPassword((curr)=>{return !curr})}/>

          <input key={props.index+props.fieldData.id+"t_2"} autoComplete="new-password" id={props.fieldData.id} type={showPassword?"text":"password"}disabled={props.disabled} required={props.fieldData.required}
            className={`border rounded-if w-full h-[20px] ${sizes[props.size].field}  ${props.fieldData.name==""?"mt-7":""} placeholder:text-slate-800`}
            value={props.prefillValues[props.fieldData.id]|| ""}
            
            onChange={(e)=>
              props.setPrefillValues((curr:any)=>{
                curr[props.fieldData.id]=e.target.value; 
                return {...curr};
              })
            }
          />

        </div>
      </div>
    )
  }
  catch(e){
    return <></>
  }
}

export default PasswordField;
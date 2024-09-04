import { useEffect, useState } from "react";
import { FormFieldAttributes } from "@/types/FormAttributes";

import FieldLabel from "./FieldLabel";
import { FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordField(props:{index:number|string, fieldData:FormFieldAttributes, size:"small"|"medium", prefillValues:any, setPrefillValues:Function, error?:boolean, disabled:boolean, readonly?:boolean}){
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(props.error);
  
  useEffect(()=>setError(props.error),[props.error]);

  try{
    return(
      <div key={props.index} className="mb-5 mx-2">
        <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
        <br />
        <FormControl variant="outlined" className={`bg-white w-[100%] ${props.fieldData.name==""?"mt-7":""}`} size={props.size} >
          <OutlinedInput id={props.fieldData.id}
            color="secondary"
            type={showPassword ? 'text' : 'password'}
            error={error}
            value={props.prefillValues[props.fieldData.id]|| ""}
            className="h-[90%]"
            sx={props.readonly?{"& .MuiOutlinedInput-input.Mui-disabled":{WebkitTextFillColor:"black"}}:{}}

            onChange={(e)=>{
              setError(false);
              props.setPrefillValues((curr:any)=>{
                curr[props.fieldData.id]=e.target.value; 
                return {...curr};
              })
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowPassword(curr=>!curr)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            inputProps={{
              'aria-label': 'weight',
            }}
          />
        </FormControl>
        
        
        
        
        {/* <div className="w-[100%] flex rounded bg-red-900" style={{backgroundColor:"white", height:"30px"}}>
          <img className={`absolute float-right ml-[5px] ${sizes[props.size].icon}` } src={showPassword?eye:eye_slash} onClick={()=>setShowPassword((curr)=>{return !curr})}/>

          <input key={props.index+props.fieldData.id+"t_2"} autoComplete="new-password" id={props.fieldData.id} type={showPassword?"text":"password"}disabled={props.disabled} required={props.fieldData.required}
            className={`border rounded-if w-full h-[20px] ${sizes[props.size].field}  ${props.fieldData.name==""?"mt-7":""} placeholder:text-slate-800`}
            
          />

        </div> */}
      </div>
    )
  }
  catch(e){
    return <></>
  }
}

export default PasswordField;
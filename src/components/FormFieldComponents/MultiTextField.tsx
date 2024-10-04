import { useEffect, useState } from "react";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldProps } from "@/types/FormComponentProps";

import FieldLabel from "./FieldLabel";
import { TextField } from "@mui/material";

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function MultiTextField (props:FormFieldProps){
  const [results,setResults] = useState<string[]>();
  const [error, setError] = useState(props.error);

  useEffect(()=>{
    setResults([""]);
  },[])

  useEffect(()=>{
    props.setFieldValues((curr:any)=>{
      curr[props.fieldData.id]=results;
      return {...curr};
    })
  },[results]);

  useEffect(()=>{
    setError(props.error);
  },[props.error])

  const addNewValue = () =>{
    setResults(curr=>{
      if (curr)
        return [...curr,""];
    })
  };

  const removeValue = () => {
    setResults(curr=>{
      if (curr && curr.length>0){
        curr.pop();
        return [...curr];
      }
    })
  }

  return (
    <div className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <div>
        {props.fieldValue && props.fieldValue.length>0
          ?<div className="grid grid-cols-5">
            {props.fieldValue.map((val:string,index:number)=>{
              return (
                <div key={index} className="my-2 mr-2">
                  <TextField error={error}
                    size="small" 
                    color="secondary" 
                    value={val} 
                    onChange={(e)=>{
                      setError(false);
                      props.setFieldValues((curr:FieldValues)=>{
                        curr[props.fieldData.id][index] = e.target.value;
                        return {...curr}; 
                      })
                    }}
                  />
                </div>
              )
            })}

            <div className="my-3">
              {props.fieldValue.length>1?<button onClick={removeValue}><RemoveCircleIcon fontSize="medium" color="error" className="mx-2" /></button>:<></>}
              <button className="mx-2" onClick={addNewValue}><AddCircleIcon fontSize="medium" color="secondary" /></button>
            </div>

          </div>
          :<></>
        }
      </div>
    </div>
  )

  /* return (
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
  ) */
}

export default MultiTextField;
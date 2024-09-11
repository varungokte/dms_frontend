import { useEffect, useState } from "react";
import moment from "moment";
import { FormFieldProps } from "@/types/FormComponentProps";
import FieldLabel from "./FieldLabel";

const getValidMinDate = (id:string, startDate?:string):string => {
  if (!startDate)
    return "";
  let date = moment(new Date()).format("yyyy-MM-DD");
  if (id!=="SD" && startDate)
    date = startDate;
  return date;
}

/* const getValidMaxDate = (id:string, prefillValues:FieldValues):string => {
  let date = "";
  if (id=="SD" && prefillValues["ED"])
    date = prefillValues["ED"];
  return date;
} */

function DateField (props:FormFieldProps & {repeatFields?:boolean, formIndex?:number, startDate?:string}) {
  const [prefillValue, setPrefillValue] = useState<string>();
  const [error,setError] = useState(props.error);

  useEffect(()=>{
    if (props.fieldValue  && !prefillValue)
      setPrefillValue(props.fieldValue);
  },[props.fieldValue]);

  useEffect(()=>setError(props.error),[props.error]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <input key={props.index+props.fieldData.id+"t_2"}
        id={props.fieldData.id} 
        type="date" 
        disabled={props.disabled} 
        required={props.fieldData.required}
        className={`border bg-white ${error?"border-red-600":"border-neutral-300"} rounded-if w-full p-3.5 text-black ${props.fieldData.name==""?"mt-7":""}`}
        value={props.fieldValue? moment(props.fieldValue).format("yyyy-MM-DD"): ""}

        min={props.fieldValue
          ?props.fieldValue
          :getValidMinDate(props.fieldData.id, props.startDate)
        } 
        /* max={props.prefillValues && props.prefillValues[props.id]
          ?props.prefillValues[props.id]
          :getValidMaxDate(props.id,props.prefillValues)
        } */
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            setError(false);
            props.setFieldValues((curr:any)=>{
              curr[props.formIndex||0][props.fieldData.id]=e.target.value; 
              return [...curr];
            });
          }
          :(e)=>{
            setError(false);
            props.setFieldValues((curr:any)=>{
              curr[props.fieldData.id]=e.target.value; 
              return {...curr};
            });
          }
        }
      />
    </div>
  )
};

export default DateField;
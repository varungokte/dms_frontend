import moment from "moment";
import FieldLabel from "./FieldLabel";
import { FieldValues, FormFieldAttributes } from "DataTypes";
import { useEffect, useState } from "react";

const getValidMinDate = (id:string, prefillValues:FieldValues):string => {
  let date = moment(new Date()).format("yyyy-MM-DD");
  if (id!=="SD" && prefillValues["SD"])
    date = prefillValues["SD"];
  return date;
}

/* const getValidMaxDate = (id:string, prefillValues:FieldValues):string => {
  let date = "";
  if (id=="SD" && prefillValues["ED"])
    date = prefillValues["ED"];
  return date;
} */

function DateField (props:{index:number|string, fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number, disabled:boolean }) {
  const [prefillValue, setPrefillValue] = useState<string>();

  useEffect(()=>{
    if (props.prefillValues && props.prefillValues[props.fieldData.id] && !prefillValue)
      setPrefillValue(props.prefillValues[props.fieldData.id]);
  },[props.prefillValues]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <input key={props.index+props.fieldData.id+"t_2"} 
        id={props.fieldData.id} 
        type="date" 
        disabled={props.disabled} 
        required={props.fieldData.required}
        className={`border rounded-if w-full p-3.5 text-black ${props.fieldData.name==""?"mt-7":""}`}
        value={props.prefillValues[props.fieldData.id]
          ?moment(props.prefillValues[props.fieldData.id]).format("yyyy-MM-DD")
          :""
        }
        min={props.prefillValues && props.prefillValues[props.fieldData.id]
          ?props.prefillValues[props.fieldData.id]
          :getValidMinDate(props.fieldData.id, props.prefillValues)
        } 
        /* max={props.prefillValues && props.prefillValues[props.id]
          ?props.prefillValues[props.id]
          :getValidMaxDate(props.id,props.prefillValues)
        } */
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.fieldData.id]=e.target.value; return [...curr];})}
          :(e)=>{props.setPrefillValues((curr:any)=>{curr[props.fieldData.id]=e.target.value; return {...curr};})}
        }
      />
    </div>
  )
};

export default DateField;
import moment from "moment";
import FieldLabel from "./FieldLabel";
import { FieldValues } from "DataTypes";

const getValidMinDate = (id:string, prefillValues:FieldValues):string => {
  let date = moment(new Date()).format("yyyy-MM-DD");
  if (id!=="SD" && prefillValues["SD"])
    date = prefillValues["SD"];
  return date;
}

const getValidMaxDate = (id:string, prefillValues:FieldValues):string => {
  let date = "";
  if (id=="SD" && prefillValues["ED"])
    date = prefillValues["ED"];
  return date;
}

function DateField (props:{index:number|string, id:string, name: string, required?:boolean, disabled?:boolean, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number }) {
  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input key={props.index+props.id+"t_2"} 
        id={props.id} 
        type="date" 
        disabled={props.disabled} 
        required={props.required}
        className={`border rounded-if w-full p-4 text-black ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]
          ?moment(props.prefillValues[props.id]).format("yyyy-MM-DD")
          :""
        }
        min={getValidMinDate(props.id, props.prefillValues)} 
        max={getValidMaxDate(props.id,props.prefillValues)}
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{props.setPrefillValues((curr:any)=>{curr[props.formIndex||0][props.id]=e.target.value; return [...curr];})}
          :(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}
        }
      />
    </div>
  )
};

export default DateField;
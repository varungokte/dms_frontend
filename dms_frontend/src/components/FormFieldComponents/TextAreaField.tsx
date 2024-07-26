import { FormFieldAttributes } from "DataTypes";
import FieldLabel from "./FieldLabel";

function TextAreaField (props:{index:number|string, fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, disabled:boolean}) {
  return (
    <div key={props.index}>
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <textarea key={props.index+"ta_2"} id={props.fieldData.id} className={`border rounded-if w-full h-full p-4`}
        value={props.prefillValues[props.fieldData.id]}
        onChange={(e)=>{
          props.setPrefillValues((curr:any)=>{
            curr[props.fieldData.id]=e.target.value; 
            return {...curr};
          })
        }}
      />
    </div>
  )
};

export default TextAreaField;
import FieldLabel from "./FieldLabel";
import { FormFieldProps } from "@/types/FormComponentProps";

function TextAreaField(props:FormFieldProps) {
  return (
    <div key={props.index}>
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <textarea key={props.index+"ta_2"} id={props.fieldData.id} className={`border rounded-if w-full h-full p-4`}
        value={props.fieldValue || ""}
        onChange={(e)=>{
          props.setFieldValues((curr:any)=>{
            curr[props.fieldData.id]=e.target.value; 
            return {...curr};
          })
        }}
      />
    </div>
  )
};

export default TextAreaField;
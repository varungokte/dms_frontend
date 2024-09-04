import { Checkbox, FormControlLabel } from "@mui/material";
import { FieldValues } from "@/types/DataTypes";
import { FormFieldAttributes } from "@/types/FormAttributes";

const CheckboxField = (props:{index:number|string, fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, disabled:boolean }) => {
  return (
    <div className="mb-5 mx-2">
      <FormControlLabel id={props.fieldData.id}
        control={<Checkbox size="medium" color="secondary" />} 
        label={props.fieldData.name} 
        
        checked={(props.prefillValues && props.prefillValues[props.fieldData.id]==true)||false}
        
        onChange={()=>{
          props.setPrefillValues((curr:FieldValues)=>{
            const oldVal = curr[props.fieldData.id];
            curr[props.fieldData.id] = !oldVal;
            return {...curr};
          });
        }}
      />
    </div>
  )
}

export default CheckboxField;
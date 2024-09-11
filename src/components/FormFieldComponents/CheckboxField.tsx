import { FormFieldProps } from "@/types/FormComponentProps";
import { FieldValues } from "@/types/DataTypes";
import { Checkbox, FormControlLabel } from "@mui/material";

const CheckboxField = (props:FormFieldProps) => {
  //console.log("checkbox props",props)
  return (
    <div className="mb-5 mx-2">
      <FormControlLabel id={props.fieldData.id}
        control={<Checkbox size="medium" color="secondary" />} 
        label={props.fieldData.name} 
        checked={Boolean(props.fieldValue)||false}
        
        onChange={()=>{
          props.setFieldValues((curr:FieldValues)=>{
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
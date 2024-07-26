import { FormFieldAttributes } from "DataTypes";

const CheckboxField = (props:{index:number|string, fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, disabled:boolean }) => {
  return (
    <div className="flex flex-row">
      <input type="checkbox" className="mr-3"  disabled={props.disabled}
        checked={(props.prefillValues && props.prefillValues[props.fieldData.id]==true)||false} 
        onChange={()=>{props.setPrefillValues((curr:any)=>{curr[props.fieldData.id]=true; return {...curr}})}} 
      />
      <p>{props.fieldData.name}</p>
    </div>
  )
}

export default CheckboxField;
import { DocumentSectionTypes, FieldAttributesList, FieldValues, FormDialogTypes, FormFieldAttributes, UserSuggestionsList } from "DataTypes";
import TextField from "../FormFieldComponents/TextField";
import CheckboxField from "../FormFieldComponents/CheckboxField";
import ComboboxField from "../FormFieldComponents/ComboboxField";
import DateField from "../FormFieldComponents/DateField";
import IntegerField from "../FormFieldComponents/IntegerField";
import MultiTextField from "../FormFieldComponents/MultiTextField";
import PasswordField from "../FormFieldComponents/PasswordField";
import PermissionsField from "../FormFieldComponents/PermissionsField";
import RoleField from "../FormFieldComponents/RoleField";
import SelectField from "../FormFieldComponents/SelectField";
import TextAreaField from "../FormFieldComponents/TextAreaField";
import FloatNumberField from "../FormFieldComponents/FloatNumberField";
import { CovenantTypeList } from "./../../../Constants";

type FormFieldsProps= {
  form:FieldAttributesList, formType:FormDialogTypes | "docs", 
  prefillValues:FieldValues, setPrefillValues:Function, 
  edit?:boolean, 
  filteredSuggestions?:UserSuggestionsList, 
  roles?:FieldValues[], setOldZone?:Function, covType?:string, setCovType?:Function
  leaderSelected?:boolean
  sectionType?:DocumentSectionTypes
}

function FormFieldsRender(props:FormFieldsProps){
  return (
    props.form.map((field,index)=>{
      if (field["category"]=="label")
        return <div key={index} className={field["sectionClassName"]}>{field["name"]}</div>
      
      else if (field["category"]=="single"){
        let disableOverride = false;
        if (props.formType=="docs" && field["id"]=="F" && props.covType!==CovenantTypeList[1])
          return null;
        else if (props.formType=="team" && field.type=="combobox" && field.id!="L" && !props.leaderSelected)
          disableOverride=true;

        return <RenderFields key={index} index={index} field={field} disableOverride={disableOverride} {...props} />
      }

      else if (field["category"]=="grid"){
        let gridStyle = "grid grid-cols-"; 
        if (field["customWidth"])
          gridStyle = "flex flex-row"
        else
          gridStyle = gridStyle + field["row"];
        return(
          <div key={index+"grid"}>
            <div key={index+"grid name"} className={field["sectionClassName"]||""}>{field["sectionName"]}</div>
            <div key={index+"gridz"} className={gridStyle}>
              {field.fields.map((item, itemIndex)=>{
                return (
                  <span key={index+"_"+itemIndex} className="mr-3">
                    <RenderFields key={index} index={index} field={item} {...props} />
                  </span>
                )
              })}
            </div>
          </div> 
        )
      }
    })
  )
}

function RenderFields (props:{index:number, field:FormFieldAttributes, disableOverride?:boolean} & FormFieldsProps){
  if (props.field["type"]=="combobox")
    return <ComboboxField key={props.index} index={props.index} fieldData={props.field} 
      prefillValue={props.prefillValues[props.field["id"]]} setPrefillValues={props.setPrefillValues} 
      disabled={(props.disableOverride||true) && ((props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false)))} 
      suggestions={props.filteredSuggestions}
    />
  else if (props.field["type"]=="role")
    return <RoleField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      roleList={props.roles||[]} 
    />
  else if (props.field["type"]=="permissions")
    return <PermissionsField key={props.index} index={props.index} fieldData={props.field} 
      permissionPreset={props.prefillValues[props.field["id"]]||{}} setPermissionSet={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />
  else if (props.field["type"]=="textarea")
    return <TextAreaField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />
  else if (props.field["type"]=="date")
    return <DateField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))}
    />
  else if (props.field["type"]=="integer")
    return <IntegerField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))}
    />
  else if (props.field["type"]=="float")
    return <FloatNumberField key={props.index} index={props.index} fieldData={props.field}
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />
  else if (props.field["type"]=="multitext")
    return <MultiTextField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />
  else if (props.field["type"]=="checkbox")
    return <CheckboxField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))}
    />
  else if (props.field["type"]=="password")
    return <PasswordField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      size="large" 
    />
  else if (props.field["type"]=="select") 
    return <SelectField key={props.index} index={props.index} fieldData={props.field}
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      setCovType={props.setCovType} 
      setOldZone={props.field["id"]=="Z"?props.setOldZone:undefined}
      sectionType={props.sectionType} 
    />
  else
    return <TextField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      size="large" 
    />
}

export default FormFieldsRender;
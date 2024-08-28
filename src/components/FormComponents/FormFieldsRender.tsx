import { FieldValues, FormDialogTypes, UserSuggestionsList } from "@/types/DataTypes";
import { FieldAttributesList, FormFieldAttributes } from "@/types/FormAttributes";
import { DocumentSectionTypes } from "@/functions/DocumentSectionAttributes";
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
import { CovenantTypeList } from "../../functions/Constants";
//import { useEffect } from "react";

type FormFieldsProps= {
  form:FieldAttributesList, formType:FormDialogTypes | "docs", 
  prefillValues:FieldValues, setPrefillValues:Function, 
  edit?:boolean, 
  filteredSuggestions?:UserSuggestionsList, leaderSuggestions?:UserSuggestionsList, teamMembers?:FieldValues,
  roles?:FieldValues[], setOldZone?:Function, covType?:string, setCovType?:Function
  sectionType?:DocumentSectionTypes
  errorList:string[]
}

function FormFieldsRender(props:FormFieldsProps){
  return (
    props.form.map((field,index)=>{
      if (field.category=="label")
        return <div key={index} className={field.sectionClassName}>{field.name}</div>
      
      else if (field.category=="single" && !(props.edit && field.hideOnEdit)){
        const error = props.errorList.includes(field.id);
        if (props.formType=="docs" && field.id=="F" && props.covType!==CovenantTypeList[1])
          return null;

        return <RenderFields key={index} index={index} field={field} error={error} {...props} />
      }

      else if (field.category=="grid"){
        const gridStyle = field.customWidth?"grid grid-cols-[70%_30%]":"grid grid-cols-" + field.row; 
        
        return(
          <div key={index+"grid"}>
            <div className={field.sectionClassName||""}>{field.sectionName}</div>
            <div className={gridStyle}>
              {field.fields.map((item, itemIndex)=>{
                if ( true/* !(props.edit && item.hideOnEdit) */){
                  const error = props.errorList.includes(item.id);
                  return <span key={index+"_"+itemIndex} className="mr-3"><RenderFields key={index} index={index} field={item} error={error} {...props} /></span>
                }
                else return <></>
              })}
            </div>
          </div> 
        )
      }
    })
  )
}

function RenderFields (props:{index:number, field:FormFieldAttributes, error?:boolean} & FormFieldsProps){
  //useEffect(()=>console.log("props.prefill values",props.prefillValues),[props.prefillValues])
  if (props.field.type=="combobox")
    return <ComboboxField key={props.index} index={props.index} fieldData={props.field} 
      prefillValue={props.formType=="team"&&props.teamMembers?props.teamMembers[props.field.id]:props.prefillValues[props.field.id]} 
      setPrefillValues={props.setPrefillValues} 
      disabled={((props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false)))} 
      suggestions={props.formType=="team" && props.field.id=="L"?props.leaderSuggestions:props.filteredSuggestions}
      error={props.error}
    />
  else if (props.field.type=="role")
    return <RoleField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      roleList={props.roles||[]} 
      error={props.error}
    />
  else if (props.field["type"]=="permissions"){console.log("form render field permission set",props.prefillValues, props.prefillValues[props.field.id])
    return <PermissionsField key={props.index} index={props.index} fieldData={props.field} 
      permissionPreset={props.prefillValues[props.field.id]||{}} setPermissionSet={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />}
  else if (props.field["type"]=="textarea")
    return <TextAreaField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
    />
  else if (props.field["type"]=="date")
    return <DateField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      error={props.error}
    />
  else if (props.field["type"]=="integer")
    return <IntegerField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues}
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      error={props.error}
    />
  else if (props.field["type"]=="float")
    return <FloatNumberField key={props.index} index={props.index} fieldData={props.field}
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))}  
      error={props.error}
    />
  else if (props.field["type"]=="multitext")
    return <MultiTextField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      error={props.error}
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
      size="medium" 
      error={props.error}
    />
  else if (props.field["type"]=="select") 
    return <SelectField key={props.index} index={props.index} fieldData={props.field}
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      setCovType={props.setCovType} 
      setOldZone={props.field.id=="Z"?props.setOldZone:undefined}
      sectionType={props.sectionType} 
      error={props.error}
    />
  else
    return <TextField key={props.index} index={props.index} fieldData={props.field} 
      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
      disabled={(props.field.disabled||false) || ((props.field.immutable||false) && (props.edit||false))} 
      size="medium" 
      error={props.error}
    />
}

export default FormFieldsRender;
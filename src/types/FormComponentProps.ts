import { FormEventHandler, SetStateAction } from "react";
import { FieldValues, FormDialogTypes, UserSuggestionTypes, DocumentSectionTypes, UserSuggestionsList } from "./DataTypes";
import { FieldAttributesList,FormFieldAttributes } from "./FormAttributes";


//FormDialog.tsx
type FormDialogProps = {
  index:number, type:FormDialogTypes, edit?:boolean,  
  formOpen:boolean, setFormOpen:Function,
  formSize:"sm"|"md"|"lg", formTitle:string, 
  submitButton:string, formSubmit:Function, 
  form:FieldAttributesList, 
  currentFields:FieldValues, repeatFields?:boolean, 
  suggestions?:UserSuggestionTypes, getRoles?:boolean 
}

//FormDialogDocuments.tsx
type FormDialogDocumentsProps = {
  index:number, type:DocumentSectionTypes, edit:boolean,
  formOpen:boolean, setFormOpen:React.Dispatch<React.SetStateAction<boolean[]>>,
  formSize:"sm"|"md"|"lg", formTitle:string,
  currentFields:FieldValues,
  detailSubmit:Function, fileSubmit:Function, deleteFile:Function, getFiles:Function, 
  formFields:FieldAttributesList, 
  currIndex?:number,
  setAdded:Function,
}

//FormDialogTeam.tsx
type FormDialogTeamProps = {
  index:number, edit?:boolean, 
  formOpen:boolean, setFormOpen:Function,
  formSize:"sm"|"md"|"lg", formTitle:string, 
  submitButton:string, formSubmit:Function, 
  form:FieldAttributesList, 
  currentFields:FieldValues, repeatFields?:boolean,
}

//FormFieldsRender.tsx
type FormFieldsRenderProps = {
  form:FieldAttributesList, formType:FormDialogTypes | "docs", 
  prefillValues:FieldValues, setPrefillValues:React.Dispatch<React.SetStateAction<FieldValues>>, 
  edit?:boolean, 
  filteredSuggestions?:UserSuggestionsList, leaderSuggestions?:UserSuggestionsList, teamMembers?:FieldValues,
  roles?:FieldValues[], setOldZone?:Function, covType?:string, setCovType?:Function
  sectionType?:DocumentSectionTypes
  errorList:string[]
}

//FormRepeatableGrid.tsx
type FormRepeatableGridProps = {
  fieldList:FormFieldAttributes[], 
  fieldValues:FieldValues[], setFieldValues:React.Dispatch<SetStateAction<FieldValues[]>>, 
  submitForm:FormEventHandler, 
  fieldsInRow:number, 
  disabled?:boolean, readonly?:boolean
}

type RenderFormGridProps = {
  key:string,
  grid:FormFieldAttributes[], 
  fieldValues:FieldValues[], setter:React.Dispatch<SetStateAction<FieldValues[]>>, 
  formIndex:number, repeatFields:boolean,
  disabled?:boolean, readonly?:boolean,
}

//All FormFieldComponents, except FileField and FieldLabel
type FormFieldProps = {
  index:string|number,
  fieldData:FormFieldAttributes,
  fieldValue:any,
  setFieldValues:Function,
  error?:boolean,
  readonly?:boolean,
  disabled:boolean,
}

export {
  type FormDialogProps, type FormDialogDocumentsProps, type FormDialogTeamProps, type FormFieldsRenderProps,
  type FormRepeatableGridProps, type RenderFormGridProps,
  type FormFieldProps,
}
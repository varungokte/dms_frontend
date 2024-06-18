type FieldValues = {
  [key:string]: any | any[]
};

type TableDataTypes = ( "index" | "text" | "date" | "priority" | "frequency" | "docStatus" | "userStatus" | "teamStatus" | "objName" | "action" | "countTeam" )[];

type FieldDataTypes = "text" | "email" | "password" | "number" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox"

type FormFieldsCommon = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  immutable?: boolean,
  options?:string[],
  multiple?:boolean,
  newRole?:boolean
};

type FormSingleFieldDetails = {category:"single"} & FormFieldsCommon;

type FormGridFieldDetails = {
  category:"grid",
  row:number,
  sectionName?:string,
  sectionClassName?:string
  fields: FormFieldsCommon[]
};

type FormLabelFieldDetails = {
  category:"label", 
  name: string,
  sectionClassName:string,
};

type FormFieldDetails = (FormSingleFieldDetails | FormGridFieldDetails | FormLabelFieldDetails)[];


type FormDialogTypes = "team"|"user"|"role"|"cont"|"rate";

type FormDialogDocumentTypes = "doc"|"cov"|"con"|"undefined";

type FormDialogDocumentSections = "TD"|"CD"|"C"|"CP"|"CS"|"undefined";

type UserSuggestionTypes = "AU"|"TL"|"RM";

type UserSuggestionsList = {
  label:string,
  values: FieldValues
}[];

export {
  type FormFieldDetails,
  type TableDataTypes,
  type FieldDataTypes,
  type FieldValues,
  type FormDialogTypes, 
  type FormDialogDocumentSections,
  type FormDialogDocumentTypes,
  type UserSuggestionTypes,
  type UserSuggestionsList,
}
import { DocumentStatusList, FileStatusList, PriorityList, TeamStatusList, UserStatusList } from "Constants";

type FieldValues = {
  [key:string]: any | any[]
};

//Data Types for table
type TableDataTypes = ( "index" | "text" | "date" | "priority" | "frequency" | "docStatus" | "userStatus" | "teamStatus" | "objName" | "action" | "countTeam" )[];

//Form Field data types
type FieldDataTypes = "text" | "email" | "password" | "number" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox"

//Form Fields
type FormFieldsCommon = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  immutable?: boolean,
  options?:string[] | readonly string[],
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

//The sections which call Form Dialog component 
type FormDialogTypes = "team"|"user"|"role"|"cont"|"rate"|"mast";

//Types of Documents
type FormDialogDocumentTypes = "doc"|"cov"|"con"|"undefined";

//Document Sections
type FormDialogDocumentSections = "TD"|"CD"|"C"|"CP"|"CS"|"undefined";


type UserSuggestionTypes = "AU"|"TL"|"RM";

type UserSuggestionsList = {
  label:string,
  values: FieldValues
}[];

type UserStatus = typeof UserStatusList[number];

type DocumentStatus = typeof DocumentStatusList[number];

type FileStatus = typeof FileStatusList[number];

type TeamStatus = typeof TeamStatusList[number];

type Priority = typeof PriorityList[number];


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
  type UserStatus,
  type DocumentStatus,
  type FileStatus,
  type TeamStatus,
  type Priority,
}
import { DocumentStatusList, FileStatusList, PriorityList, TeamStatusList, UserStatusList } from "Constants";

type FieldValues = {[key:string]: any | any[]};

//Data Types for table
type TableDataTypes = ( "index" | "text" | "date" | "priority" | "frequency" | "doc-status" | "user-status" | "team-status" | "obj-name" | "action" | "count-team" | "text-field");

//Form Field data types
type FieldDataTypes = "text" | "email" | "password" | "number" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox" | "radio" | "break"

//Form Fields
type FormFieldsCommon = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  immutable?: boolean,
  numtype?:"rate"|"curr", //for number
  options?:string[] | readonly string[], //for select
  multiple?:boolean, //for combobox 
  newRole?:boolean //for permissions/role
};

type SingleFieldAttributes = {category:"single"} & FormFieldsCommon;

type GridFieldAttributes = {
  category:"grid",
  row:number,
  sectionName?:string,
  sectionClassName?:string,
  customWidth?:string,
  fields: FormFieldsCommon[]
};

type LabelFieldAttributes = {
  category:"label", 
  name: string,
  sectionClassName:string,
};

type FieldAttributesList = (SingleFieldAttributes | GridFieldAttributes | LabelFieldAttributes)[];

//The sections which call Form Dialog component 
type FormDialogTypes = "team"|"user"|"role"|"cont"|"rate"|"mast";

//Document Sections
type DocumentSectionTypes = "doc"|"cov"|"con"|"pay"|"undefined";
type DocumentSectionNames = "TD"|"CD"|"C"|"CP"|"CS"|"PD";
type DocumentSectionDetails = {
  sectionName: DocumentSectionNames,
  sectionType: DocumentSectionTypes
}

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

type LoanCommonProps = {
  actionType:string, 
  label:string, 
  AID:string, 
  setAID:Function, 
  loanId:string, 
  setLoanId:Function, 
  currentSection:number, 
  setCurrentSection:Function, 
  goToNextSection:Function, 
  setUnsavedWarning:Function,
  setShowSecurityDetails:Function,
  showSecurityDetails:boolean,
  setOkToFrolic:Function,
  preexistingValues:FieldValues,
  setChangesHaveBeenMade:Function,
  setEnableDocumentSections:Function,
  assignedTeam:string,
  teamList:any
}

export {
  type FieldValues,
  type TableDataTypes, type FieldDataTypes,
  type SingleFieldAttributes, type GridFieldAttributes, type LabelFieldAttributes, type FieldAttributesList,
  type FormDialogTypes, 
  type DocumentSectionTypes, type DocumentSectionNames, type DocumentSectionDetails,
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority,
  type LoanCommonProps,
}
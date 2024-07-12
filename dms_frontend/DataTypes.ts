import { DocumentStatusList, FileStatusList, PriorityList, TeamStatusList, UserStatusList } from "Constants";

type FieldValues = {[key:string]: any | any[]};

//Data Types for table
type TableDataTypes = "index" | "text" | "date" | "priority" | "frequency" | "doc-status" | "user-status" | "team-status" | "obj-name" | "action" | "count-team" | "text-field" | "doc-link";

//Form Field data types 
type FieldDataTypes = "text" | "email" | "password" | "integer" | "float" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox" | "radio" | "break";

//Form Fields
type FormFieldAttributes = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  disabled?:boolean,
  immutable?: boolean,
  options?:string[] | readonly string[], //for select
  multiple?:boolean, //for combobox 
  newRole?:boolean //for permissions/role
};

type SingleFieldAttributes = {category:"single"} & FormFieldAttributes;

type GridFieldAttributes = {
  category:"grid",
  row:number,
  sectionName?:string,
  sectionClassName?:string,
  customWidth?:string,
  fields: FormFieldAttributes[]
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
type DocumentSectionDetails = { sectionName:DocumentSectionNames, sectionType:DocumentSectionTypes }

type UserSuggestionTypes = "AU"|"TL"|"RM";
type UserSuggestionsList = { label:string, values:FieldValues }[];

type UserStatus = typeof UserStatusList[number];
type DocumentStatus = typeof DocumentStatusList[number];
type FileStatus = typeof FileStatusList[number];
type TeamStatus = typeof TeamStatusList[number];
type Priority = typeof PriorityList[number];

type CommonFileViewerProps = {AID:string, fileName:string, actualName:string, status:DocumentStatus, rejectionReason?:string, setAdded:Function,sectionName:string };
type DocumentFileViewerProps = {type:"doc", loanId:string, docId:string, };
type PaymentFileViewerProps = {type:"pay", _id:string, index:number, schedule:FieldValues[] };

type LoanCommonProps = {
  actionType:string, label:string, 
  AID:string, setAID:Function, 
  loanId:string, setLoanId:Function, 
  currentSection:number, setCurrentSection:Function, sectionCount:number,
  goToNextSection:Function, 
  setOkToFrolic:Function, setUnsavedWarning:Function,
  showSecurityDetails:boolean, setShowSecurityDetails:Function,
  setChangesHaveBeenMade:Function, setEnableDocumentSections:Function,
  assignedTeam:string, teamList:any
  preexistingValues:FieldValues,
}

type ToastOptionsAttributes ={open:boolean, type:"error"|"success", action:"add"|"delete"|"edit",section:string};

export {
  type FieldValues,
  type TableDataTypes, type FieldDataTypes,
  type FormFieldAttributes, type SingleFieldAttributes, type GridFieldAttributes, type LabelFieldAttributes, type FieldAttributesList,
  type FormDialogTypes, 
  type DocumentSectionTypes, type DocumentSectionNames, type DocumentSectionDetails,
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority,
  type CommonFileViewerProps, type DocumentFileViewerProps, type PaymentFileViewerProps,
  type LoanCommonProps,
  type ToastOptionsAttributes,
}
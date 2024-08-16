import { DocumentStatusList, FileStatusList, LoanStatusList, PriorityList, TeamStatusList, UserStatusList } from "Constants";
import { FunctionComponent } from "react";

type FieldValues = {[key:string]: any | any[]};

//Data Types for table
type TableDataTypes = "index" | "text" | "date" | "priority" | "frequency" | "doc-status" | "user-status" | "team-status" | "loan-status" | "obj-name" | "action" | "count-team" | "text-field" | "doc-link" | "checkbox";
//Form Field data types 
type FieldDataTypes = "text" | "email" | "password" | "integer" | "float" | "date" | "select" | "role" | "combobox" | "multitext" | "textarea" | "permissions" | "checkbox" | "radio" | "break" | "number";


//Form Fields
type FormFieldAttributes = {
  id:string,
  name:string,
  type: FieldDataTypes,
  required?: boolean,
  disabled?:boolean,
  immutable?: boolean,
  suppressCommas?:boolean, //for integer
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


type UserSuggestionTypes = "AU"|"TL"|"RM";
type UserSuggestionsList = { label:string, values:FieldValues }[];


//Status Types
type UserStatus = typeof UserStatusList[number];
type DocumentStatus = typeof DocumentStatusList[number];
type FileStatus = typeof FileStatusList[number];
type TeamStatus = typeof TeamStatusList[number];
type LoanStatus = typeof LoanStatusList[number];
type Priority = typeof PriorityList[number];


//Component Props
type CommonFileViewerProps = {AID:string, fileName:string, actualName:string, status:DocumentStatus, rejectionReason?:string, setAdded:Function,sectionKeyName:string, disabled?:boolean, setIsDeleted:Function };
type DocumentFileViewerProps = {type:"doc", loanId:string, docId:string };
type PaymentFileViewerProps = {type:"pay", scheduleId:string, index:number, schedule:FieldValues[] };

type LoanCommonProps = {
  actionType:"CREATE"|"EDIT"|"VIEW", label:string, 
  AID:string, setAID:Function, 
  loanId:string, setLoanId:Function, 
  currentSection:number, setCurrentSection:Function, sectionCount:number,
  goToNextSection:Function, 
  setOkToFrolic:Function, setUnsavedWarning:Function,
  showSecurityDetails:boolean, setShowSecurityDetails:Function,
  setChangesHaveBeenMade:Function, setEnableDocumentSections:Function,
  assignedTeam:string,
  preexistingValues:FieldValues,
}
type ComponentList = {name:string,path:string, component:FunctionComponent<any>, icon?:Function, panopticPage?:boolean}[];

type ToastOptionsAttributes ={open:boolean, type:"error"|"success", action:"add"|"delete"|"edit"|"save",section:string};

export {
  type FieldValues,
  type TableDataTypes, type FieldDataTypes,
  type FormFieldAttributes, type SingleFieldAttributes, type GridFieldAttributes, type LabelFieldAttributes, type FieldAttributesList,
  type FormDialogTypes, 
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority, type LoanStatus,
  type CommonFileViewerProps, type DocumentFileViewerProps, type PaymentFileViewerProps,
  type LoanCommonProps,
  type ToastOptionsAttributes,
  type ComponentList,
}
import { DocumentStatusList, FileStatusList, LoanStatusList, PriorityList, TeamStatusList, UserStatusList } from "@/functions/Constants";

type FieldValues = {[key:string]: any | any[]};

//Data Types for table
type TableDataTypes = "index" | "text" | "date" | "priority" | "frequency" | "doc-status" | "user-status" | "team-status" | "loan-status" | "obj-name" | "action" | "count-team" | "text-field" | "doc-link" | "checkbox";

//The sections which call Form Dialog component 
type FormDialogTypes = "team"|"user"|"role"|"cont"|"rate"|"mast";

//Period Type
type IntervalType = "weekly"|"monthly"|"yearly";

//Types of User Suggestions
type UserSuggestionTypes = "AU"|"TL"|"RM";

type UserSuggestionsList = { label:string, values:FieldValues }[];

//setState Types
type SetStateBoolean = React.Dispatch<React.SetStateAction<boolean>>;

//Status Types
type UserStatus = typeof UserStatusList[number];
type DocumentStatus = typeof DocumentStatusList[number];
type FileStatus = typeof FileStatusList[number];
type TeamStatus = typeof TeamStatusList[number];
type LoanStatus = typeof LoanStatusList[number];
type Priority = typeof PriorityList[number];


type ToastOptionsAttributes ={open:boolean, type:"error"|"success", action:"add"|"delete"|"edit"|"save"|"sent",section:string};

export {
  type FieldValues,
  type TableDataTypes,
  type FormDialogTypes, 
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority, type LoanStatus,
  type ToastOptionsAttributes,
  type IntervalType,
  type SetStateBoolean,
}

import { DocumentStatusList, FileStatusList, LoanStatusList, PriorityList, TeamStatusList, UserStatusList } from "@/functions/Constants";

type FieldValues = {[key:string]: any | any[]};

type TableDataTypes = "index" | "text" | "date" | "priority" | "doc-status" | "user-status" | "team-status" | "loan-status" | "obj-name" | "action" | "count-team" | "text-field" | "doc-link" | "checkbox";

type FormDialogTypes = "team" | "user" | "role" | "cont" | "rate" | "mast";

type FrequencyTypes = "weekly"|"monthly"|"yearly";

type UserSuggestionTypes = "AU"|"TL"|"RM";
type UserSuggestionsList = { label:string, values:FieldValues }[];

type SetStateBoolean = React.Dispatch<React.SetStateAction<boolean>>;

type UserStatus = typeof UserStatusList[number];
type DocumentStatus = typeof DocumentStatusList[number];
type FileStatus = typeof FileStatusList[number];
type TeamStatus = typeof TeamStatusList[number];
type LoanStatus = typeof LoanStatusList[number];
type Priority = typeof PriorityList[number];

type ToastOptionsAttributes ={open:boolean, type:"error"|"success", action:"add"|"delete"|"edit"|"save"|"sent",section:string};

type DocumentSectionTypes = "document"|"covenant"|"condition"|"payment"|"undefined";
type DocumentSectionKeys = "TD"|"CD"|"C"|"CP"|"CS"|"PD";
type DocumentSectionDetails = { sectionKeyName:DocumentSectionKeys, sectionType:DocumentSectionTypes };

type DealDetails= {
  _id:string,
  AID:string, 
  CN:string,
  SD:Date|string,
  details: {S:DocumentStatus}[],
}

export {
  type FieldValues,
  type TableDataTypes,
  type FormDialogTypes, 
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority, type LoanStatus,
  type ToastOptionsAttributes,
  type FrequencyTypes as IntervalType,
  type SetStateBoolean,
  type DocumentSectionTypes, type DocumentSectionKeys, type DocumentSectionDetails,
  type DealDetails,
};

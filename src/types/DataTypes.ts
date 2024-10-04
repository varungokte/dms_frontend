import {statusValues} from "@/Constants";

type FieldValues = {[key:string]: any | any[]};

type MastersValues = {
  [key in 
    "LoanProductList"| "ZoneList"| "FileTypeList"| "IndustryList"| "LoanTypeList"| "ProjectStatusList"| "DSRAFormList"|
    "LoanSecurityTypeList"| "BankAccountTypeList"| 
    "ContactTypeList"| "EmailRecipientList"|
    "RatingAgencyList"| "RatingTypeList"| "RatingOutlookList"|
    "TransactionCategoryList"| "ComplianceCategoryList"| "CovenantCategoryList"| "CovenantTypeList"| "ConditionPrecedentCategoryList"| "ConditionSubsequentCategoryList"|
    "DocumentRejectionReasonList"|
    "TableRowsPerPage"
  ]: string[]
};


type FormDialogTypes = "team" | "user" | "role" | "cont" | "rate" | "mast";

type FrequencyTypes = "weekly"|"monthly"|"yearly";

type UserSuggestionTypes = "AU"|"TL"|"RM";
type UserSuggestionsList = { label:string, values:FieldValues }[];

type SetStateBoolean = React.Dispatch<React.SetStateAction<boolean>>;

const { DocumentStatusList, FileStatusList, LoanStatusList, PriorityList, TeamStatusList, UserStatusList } = statusValues;

type UserStatus = typeof UserStatusList[number];
type DocumentStatus = typeof DocumentStatusList[number];
type FileStatus = typeof FileStatusList[number];
type TeamStatus = typeof TeamStatusList[number];
type LoanStatus = typeof LoanStatusList[number];
type Priority = typeof PriorityList[number];

type ToastOptionsAttributes ={open:boolean, type:"error"|"success", action:"add"|"delete"|"edit"|"save"|"sent"|"remove",section:string, custom?:string};

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
  type FieldValues, type MastersValues,
  type FormDialogTypes, 
  type UserSuggestionTypes, type UserSuggestionsList,
  type UserStatus, type DocumentStatus, type FileStatus, type TeamStatus, type Priority, type LoanStatus,
  type ToastOptionsAttributes,
  type FrequencyTypes as IntervalType,
  type SetStateBoolean,
  type DocumentSectionTypes, type DocumentSectionKeys, type DocumentSectionDetails,
  type DealDetails,
};

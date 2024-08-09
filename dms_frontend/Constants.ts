import { FieldValues } from "DataTypes";

//import { useState } from "react";

const sectionNames:FieldValues = {
  "Masters":"masters",
  "Role Management":"role",
  "Team Management":"team",
  "User Management":"user",
  "Loan Account":"loan",
  "Contact Details":"contact",
  "Ratings":"rating",
  "Transaction Documents":"transaction",
  "Compliance Documents":"compliance",
  "Covenants":"covenants",
  "Condition Precedent":"precedent",
  "Condition Subsequent":"subsequent",
  "Payment Schedule":"payment",
  "Reminders":"reminders",
  "Default Cases":"default",
  "Critical Cases":"critical",
  "Reports":"reports",
  "Master Default Cases":"default/mst",
  "Master Critical Cases":"critical/mst",
  "Master Transaction Documents":"transaction/mst",
  "Master Compliance Documents":"compliance/mst",
  "Master Covenants":"covenants/mst",
  "Master Condition Precedent":"precedent/mst",
  "Master Condition Subsequent":"subsequent/mst",
  "Master Payment Schedule":"payment/mst",
}

const documentSectionNames = [
  { fullname: "Transaction Documents", shortname: "transaction", keyname:"TD", type: "doc" },
  { fullname: "Compliance Documents", shortname: "compliance", keyname:"CD", type: "doc" },
  { fullname: "Covenants", shortname: "covenants", keyname:"C", type: "cov" },
  { fullname: "Condition Precedent", shortname: "precedent", keyname:"CP", type: "con" },
  { fullname: "Condition Subsequent", shortname: "subsequent", keyname:"CS", type: "con" },
  { fullname: "Payment Schedule", shortname: "payment", keyname:"PD", type: "pay" }
];

const getDocSecName = (inputName:string, inputType:"fullname"|"keyname"|"shortname"|"type", outputType:"fullname"|"keyname"|"shortname"|"type") => {
  for (let i=0; i<documentSectionNames.length; i++){
    const doc = documentSectionNames[i];
    if (doc[inputType]==inputName)
      return doc[outputType];
  }
  return "";
};
const getDocSecList = (outputType:"fullname"|"keyname"|"shortname"|"type") =>{
  return documentSectionNames.map(doc=>doc[outputType]);
} 

const checkObjectsAreEqual = (obj1:FieldValues, obj2:FieldValues) => {
  for (let i=0; i<Object.keys(obj1).length; i++){
    const key = Object.keys(obj1)[i];
    const val1 = obj1[key];
    const val2 = obj2[key];
    console.log("key",key,"val1",val1, "val2",val2);
    if (typeof val1 == "function" && typeof val2 == "function")
      continue;
    else if (Array.isArray(val1) && Array.isArray(val2)){}
    else if (val1!==val2){console.log("UNEQUAL",val1,val2);
      return false;}
  }
  return true;
}

//Masters
const LoanProductList:string[] = ["-"];
const ZoneList:string[] = ["-"];
const FileTypeList:string[] = ["-", "PDF", "DOCX", "XLSX", "CSV", "PNG", "JPEG"];
const UserRoleList:string[] = ["-"];
const IndustryList:string[] = ["-",""];/* , "Real Estate","NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others" */
const LoanTypeList:string[] = ["-", "Long Term", "Short Term"];
const DocumentRejectionReasonList:string[] = ["-","Document is expired", "Document is incomplete", "Document is irrelevant"];
const TableRowsPerPage:number[] = [-1,2,5,10];

//Statuses
const PriorityList =["-", "Low", "Medium", "High"] as const;
const UserStatusList = ["-", "Unverified", "Active", "Inactive"] as const;
const TeamStatusList = ["-", "Active", "Inactive"] as const;
const DocumentStatusList = ["-", "Pending", "In progress", "Verified", "Rejected", "Overdue"] as const;
const FileStatusList = ["-", "Pending",  "Verified"] as const;
const LoanStatusList = ["-","Preliminary", "Document", "Live", "Hold", "Cancel"] as const;

//Basics
const FrequencyList:string[] = ["-", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const LoanSecuredList:string[] = ["-","Secured","Unsecured"];
const YesOrNoList:string[] = ["-", "Yes","No"];
const HolidayConventionList:string[] = ["-","Precedent","Subsequent","None"];
const InterestTypeList:string[] = ["-", "Fixed","Manual"];

//Loan Details
const ProjectStatusList:string[] = ["-","Not Started","In Progress","Finished"];
const DSRAFormList:string[] = ["-","LC","BG", "FD"];
const LoanSecurityTypeList:string[] = ["-","[PLACEHOLDER DATA] Type A","[PLACEHOLDER DATA] Type B"];
const BankAccountTypeList:string[] = ["-", "Saving", "Current"];

//Contact Details
const ContactTypeList:string[] = ["-", "Borrower", "Lender", "Lender Agent", "Promotor", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer"];
const EmailRecipientList:string[] = ["-","To", "Cc","Bcc"];

//Ratings
const RatingAgencyList:string[] = ["-", "ICRA", "CRISIL"];
const RatingTypeList:string[] = ["-", "Provisional","Final"];
const RatingOutlookList:string[] = ["-", "Negative", "Stable", "Positive"];

//Documents
const TransactionCategoryList:string[] = ["-", "Common Loan Agreements","Security Trustee Agreement","Lenders Agent Agreement","Escrow Agreement","Substitution Agreement","Subordination Agreement","Supplementary Escrow Agreement","Sponsors Undertakings","Security documents","Pledge Agreement","Consent to Assignment","Trust and Retention Account Agreement"];
const ComplianceCategoryList:string[] = ["-","Common Loan Agreement", "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement"];

const CovenantCategoryList:string[] = ["-", "Financial Covenant","Non-Financial Covenant"];
const CovenantTypeList:string[] = ["-", "Periodic", "Event-Based"];

const ConditionPrecedentCategoryList:string[] = ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"];
const ConditionSubsequentCategoryList:string[] = ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"];

const MastersMapping:FieldValues = {
  "-":"-",
  "Zone":ZoneList,
  "Loan Product":LoanProductList,
  "File Types":FileTypeList,
  "Industry":IndustryList,
  "Loan Types":LoanTypeList,
  "Security Types":LoanSecurityTypeList,
  "Transaction Document Categories":TransactionCategoryList,
  "Compliance Document Categories":ComplianceCategoryList,
  "Condition Precedent Categories":ConditionPrecedentCategoryList,
  "Condition Subsequent Categories":ConditionSubsequentCategoryList,
}

export { 
  MastersMapping, sectionNames, getDocSecList,getDocSecName, checkObjectsAreEqual,
  LoanProductList, ZoneList, FileTypeList, UserRoleList, IndustryList, LoanTypeList, DocumentRejectionReasonList, TableRowsPerPage,
  PriorityList,UserStatusList,TeamStatusList,DocumentStatusList,FileStatusList, LoanStatusList,
  InterestTypeList, FrequencyList, LoanSecuredList, YesOrNoList, HolidayConventionList,
  ProjectStatusList,DSRAFormList, LoanSecurityTypeList,BankAccountTypeList, 
  ContactTypeList, EmailRecipientList,
  RatingAgencyList,RatingTypeList,RatingOutlookList,
  TransactionCategoryList,ComplianceCategoryList,
  CovenantCategoryList,CovenantTypeList,
  ConditionPrecedentCategoryList,ConditionSubsequentCategoryList,
};
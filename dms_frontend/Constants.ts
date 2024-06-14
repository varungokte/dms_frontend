//Masters
const LoanProductList:string[] = ["-", "Term Loan","Drop-line LOC","WCDL","Debentures"];
const ZoneList:string[] = ["-", "West", "South", "East", "North"];
const FrequencyList:string[] = ["-", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const FileTypeList:string[] = ["-", "PDF", "DOCX", "XLSX", "CSV", "PNG", "JPEG"];
const UserRoleList:string[] = ["-","Maker", "Checker", "Admin", "Superadmin"];
const IndustryList:string[] = ["-", "Real Estate","NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others"];
const LoanTypeList:string[] = ["-", "Long Term", "Short Term"];

//Loan Details
const LoanSecuredList:string[] = ["-","Secured","Unsecured"];
const ProjectStatusList:string[] = ["-","Not Started","In Progress","Finished"];
const DSRAFormList:string[] = ["-","LC","BG", "FD"];
const LoanSecurityTypeList:string[] = ["-","Type A","Type B"];
const BankAccountTypeList:string[] = ["-", "Saving", "Current"];
const YesOrNoList:string[] = ["-", "Yes","No"];

//Contact Details
const ContactTypeList:string[] = ["-", "Borrower" , "Promotor", "Lender", "Lender Agent", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer"];
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

const ConditionPrecedentCategoryList:string[] = ["-", "Condition A", "Condition B"];
const ConditionSubsequentCategoryList:string[] = ["-", "Condition A", "Condition B"];

export {
  LoanProductList, ZoneList, FrequencyList, FileTypeList,UserRoleList, IndustryList, LoanTypeList, YesOrNoList,
  LoanSecuredList,ProjectStatusList,DSRAFormList, 
  LoanSecurityTypeList,BankAccountTypeList, 
  ContactTypeList, EmailRecipientList,
  RatingAgencyList,RatingTypeList,RatingOutlookList,
  TransactionCategoryList,ComplianceCategoryList,
  CovenantCategoryList,CovenantTypeList,
  ConditionPrecedentCategoryList,ConditionSubsequentCategoryList
};
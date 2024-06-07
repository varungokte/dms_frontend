enum UserRoles { "-","Maker", "Checker", "Admin", "Superadmin", };

enum UserStatusValues { "-","Unverified", "Active", "Inactive" };

enum UserStatusStyling { "-","text-yellow-600 bg-yellow-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100" };

enum DocumentStatusValues { "-","Pending", "In Progress", "Verified", "Overdue" };

enum DocumentStatusStyling { "-","text-yellow-500", "text-blue-500", "text-green-600", "text-red-600" };

enum TransactionDocumentTypes { "-", "Common Loan Agreements","Security Trustee Agreement","Lenders Agent Agreement","Escrow Agreement","Substitution Agreement","Subordination Agreement","Supplementary Escrow Agreement","Sponsors Undertakings","Security documents","Pledge Agreement","Consent to Assignment","Trust and Retention Account Agreement",};

enum ComplianceDocumentTypes { "-","Common Loan Agreement", "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement" };

enum CovenantDocumentTypes { "-", "Financial Covenant","Non-Financial Covenant"};

enum ConditionPrecedentTypes {"-", "Condition A", "Condition B"};

enum ConditionSubsequentTypes {"-", "Condition A", "Condition B"};

enum FileStatusValue { "-", "Pending", "Verified"};

enum FileStatusStyling { "-", "text-yellow-500", "text-green-600" };

enum FileTypes { "-", "PDF", "DOCX", "XLSX", "CSV", "PNG", "JPEG" };

enum PriorityValues { "-", "Low", "Medium", "High", };

enum PriorityStyling { "-", "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100", };

enum CovenantType { "-", "Periodic", "Event-Based"};

enum RatingAgencies { "-", "ICRA", "CRISIL"};

enum RatingTypes { "-", "Provisional","Final" };

enum RatingOutlook { "-", "Negative", "Stable", "Positive" };

enum RatingValues { "-", "AA-(Stable)", "A1+", "Gold Status" };

enum ZoneList { "-", "West", "South", "East", "North"};

enum ContactType { "-", "Borrower" , "Promotor", "Lender", "Lender Agent", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer" };

enum IndustryList { "-", "Real Estate","NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others" };

enum LoanType { "-", "Long Term", "Short Term" };

enum LoanProduct { "-", "Term Loan","Drop-line LOC","WCDL","Debentures" };

enum FrequencyType { "-", "Monthly", "Quarterly", "Half-Yearly", "Yearly"};

enum BankAccountType {"-", "Saving", "Current"};

const EnumIteratorKeys = (list: any) => {
  return Object.keys(list).filter(v=>!isNaN(Number(v)) && v!="0")
};

const EnumIteratorValues = (list: any) => {
  return Object.keys(list).filter(v=>isNaN(Number(v)) && v!="-")
};

export {
  UserRoles, UserStatusValues, UserStatusStyling, 
  DocumentStatusValues, DocumentStatusStyling, 
  FileStatusValue, FileStatusStyling, FileTypes,
  PriorityValues, PriorityStyling,
  CovenantType,
  RatingTypes, RatingOutlook, RatingAgencies, RatingValues,
  ZoneList, IndustryList, LoanType, LoanProduct,
  ContactType,
  FrequencyType,
  TransactionDocumentTypes, ComplianceDocumentTypes, CovenantDocumentTypes, ConditionPrecedentTypes, ConditionSubsequentTypes,
  BankAccountType,
  EnumIteratorKeys, EnumIteratorValues,
};
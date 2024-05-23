enum UserRoles { "Maker"=1, "Checker", "Admin", "Superadmin", };

enum UserStatusValues { "Unverified"=1, "Active", "Inactive" };

enum UserStatusStyling { "text-yellow-600 bg-yellow-100"=1, "text-green-600 bg-green-100", "text-red-600 bg-red-100" };

enum DocumentStatusValues { "Pending"=1, "In Progress", "Verified", "Overdue" };

enum DocumentStatusStyling { "text-green-600"=1, "text-yellow-600", "text-red-600", };

enum TransactionDocumentTypes {"", "Common Loan Agreements","Security Trustee Agreement","Lenders Agent Agreement","Escrow Agreement","Substitution Agreement","Subordination Agreement","Supplementary Escrow Agreement","Sponsors Undertakings","Security documents","Pledge Agreement","Consent to Assignment","Trust and Retention Account Agreement",};

enum ComplianceDocumentTypes { "Common Loan Agreement"=1, "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement" };

enum CovenantDocumentTypes {"Covenant Type A"=1,"Covenant Type B"};

enum ConditionPrecedentTypes {"Condition A"=1, "Condition B"};

enum ConditionSubsequentTypes {"Condition A"=1, "Condition B"};

enum FileStatusValue { "Pending"=1, "In Progress", "Verified", "Overdue"};

enum FileTypes {"Any"=1, "PDF", "DOCX"};

enum PriorityValues { "Low"=1, "Medium", "High", };

enum PriorityStyling { "text-green-600 bg-green-100"=1, "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100", };

enum CovenantType {"Periodic"=1, "Event-Based"};

enum RatingAgencies { "ICRA"=1, "CRISIL"};

enum RatingTypes { "Provisional"=1,"Final" };

enum RatingOutlook {"Negative"=1, "Stable", "Positive" };

enum RatingValues { "AA-(Stable)"=1, "A1+", "Gold Status" };

enum ZoneList {"West"=1, "South", "East", "North"};

enum ContactType { "Borrower"=1 , "Promotor", "Lender", "Lender Agent", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer" };

enum IndustryList { "Real Estate"=1,"NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others" };

enum LoanType { "Long Term"=1, "Short Term" };

enum LoanProduct { "Term Loan"=1,"Drop-line LOC","WCDL","Debentures" };

enum FrequencyType {"Monthly"=1, "Quarterly", "Half-Yearly", "Yearly"};

enum BankAccountType {"Saving"=1, "Current"};

const EnumIteratorKeys = (list: any) => {
  return Object.keys(list).filter(v=>!isNaN(Number(v)))
};

const EnumIteratorValues = (list: any) => {
  return Object.keys(list).filter(v=>isNaN(Number(v)))
};

export {
  UserRoles, UserStatusValues, UserStatusStyling, 
  DocumentStatusValues, DocumentStatusStyling, 
  FileStatusValue, FileTypes,
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
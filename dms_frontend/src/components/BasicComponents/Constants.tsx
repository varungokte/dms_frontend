enum UserRoles { "Maker", "Checker", "Admin", "Superadmin", };

enum UserStatusValues { "Unverified"=1, "Active", "Inactive" };

enum UserStatusStyling { "text-yellow-600 bg-yellow-100"=1, "text-green-600 bg-green-100", "text-red-600 bg-red-100" };

enum DocumentStatusValues { "Pending", "In Progress", "Verified", "Overdue" };

enum DocumentStatusStyling { "text-green-600", "text-yellow-600", "text-red-600", };

enum TransactionDocumentTypes { "Common Loan Agreement", "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement" };

enum FileStatusValue { "Pending", "In Progress", "Verified", "Overdue"};

enum FileTypes {"Any", "PDF", "DOCX"};

enum PriorityValues { "Low", "Medium", "High", };

enum PriorityStyling { "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100", };

enum CovenantType {"Periodic", "Event-Based"};

enum RatingAgencies { "ICRA", "CRISIL"};

enum RatingTypes { "Provisional","Final" };

enum RatingOutlook {"Negative", "Stable", "Positive" };

enum RatingValues { "AA-(Stable)", "A1+", "Gold Status" };

enum ZoneList {"West"=1, "South", "East", "North"};

enum ContactType { "Borrower"=1 , "Promotor", "Lender", "Lender Agent", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer" };

enum IndustryList { "Real Estate"=1,"NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others" };

enum LoanType { "Long Term"=1, "Short Term" };

enum LoanProduct { "Term Loan"=1,"Drop-line LOC","WCDL","Debentures" };

enum FrequencyType {"Monthly", "Quarterly", "Half-Yearly", "Yearly"};

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
  EnumIteratorKeys, EnumIteratorValues,
  ContactType,
  FrequencyType,
  TransactionDocumentTypes,
};
enum UserRoles { "Maker", "Checker", "Admin", "Superadmin", };

enum UserStatusValues { "Unverified"=1, "Active", "Inactive" };

enum UserStatusStyling { "text-yellow-600 bg-yellow-100"=1, "text-green-600 bg-green-100", "text-red-600 bg-red-100" };

enum DocumentStatusValues { "Complete", "In Progress", "Overdue", };

enum DocumentStatusStyling { "text-green-600", "text-yellow-600", "text-red-600", };

enum PriorityValues { "Low", "Medium", "High", };

enum PriorityStyling { "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100", };

enum RatingTypes { "Provisional","Final" };

enum RatingOutlook {"Negative", "Stable", "Positive" };

enum ZoneList {"West"=1, "South", "East", "North"};

enum IndustryList {
  "Real Estate"=1,
  "NBFC",
  "NBFC-MFI", 
  "Bank",
  "Diversified Conglomerate",
  "Education",
  "Healthcare & Pharma",
  "Hospitality Manufacturing", 
  "Renewable Energy", 
  "Roads",
  "Commercial Space", 
  "Others" 
};

enum LoanType { "Long Term"=1, "Short Term" };

enum LoanProduct { "Term Loan"=1,"Drop-line LOC","WCDL","Debentures" };

const EnumIteratorKeys = (list: any) => {
  return Object.keys(list).filter(v=>!isNaN(Number(v)))
};

const EnumIteratorValues = (list: any) => {
  return Object.keys(list).filter(v=>isNaN(Number(v)))
};

export {
  UserRoles, UserStatusValues, UserStatusStyling, 
  DocumentStatusValues, DocumentStatusStyling, 
  PriorityValues, PriorityStyling,
  RatingTypes, RatingOutlook, 
  ZoneList, IndustryList, LoanType, LoanProduct,
  EnumIteratorKeys, EnumIteratorValues,
};
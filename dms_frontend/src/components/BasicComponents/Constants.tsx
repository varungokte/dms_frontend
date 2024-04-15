enum UserRoles { "Maker", "Checker", "Admin", "Superadmin", };

enum UserStatusValues { "Inactive", "Active", };

enum UserStatusStyling { "text-red-600 bg-red-100", "text-green-600 bg-green-100", };

enum DocumentStatusValues { "Complete", "In Progress", "Overdue", };

enum DocumentStatusStyling { "text-green-600", "text-yellow-600", "text-red-600", };

enum PriorityValues { "Low", "Medium", "High", };

enum PriorityStyling { "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100", };

enum RatingTypes { "Provisional","Final" };

enum RatingOutlook {"Negative", "Stable", "Positive" };

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
  EnumIteratorKeys, EnumIteratorValues,
};
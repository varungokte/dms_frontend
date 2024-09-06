import { createContext } from 'react';
import { FieldValues } from '@/types/DataTypes';
//import { ZoneList, LoanProductList, FileTypeList, IndustryList, LoanTypeList, LoanSecurityTypeList, TransactionCategoryList, ComplianceCategoryList, ConditionPrecedentCategoryList, ConditionSubsequentCategoryList } from './Constants';

const PermissionContext = createContext<{userPermissions:FieldValues, setUserPermissions:React.Dispatch<React.SetStateAction<FieldValues|undefined>>}>({
  userPermissions:{},
  setUserPermissions:()=>{}
});

const LoanProductList:string[] = ["-"];
const ZoneList:string[] = ["-"];
const FileTypeList:string[] = ["-", "PDF", "DOCX", "XLSX", "CSV", "PNG", "JPEG"];
const IndustryList:string[] = ["-",""];/* , "Real Estate","NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others" */
const LoanTypeList:string[] = ["-", "Long Term", "Short Term"];
const LoanSecurityTypeList:string[] = ["-","[PLACEHOLDER DATA] Type A","[PLACEHOLDER DATA] Type B"];

const TransactionCategoryList:string[] = ["-", "Common Loan Agreements","Security Trustee Agreement","Lenders Agent Agreement","Escrow Agreement","Substitution Agreement","Subordination Agreement","Supplementary Escrow Agreement","Sponsors Undertakings","Security documents","Pledge Agreement","Consent to Assignment","Trust and Retention Account Agreement"];
const ComplianceCategoryList:string[] = ["-","Common Loan Agreement", "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement"];

const ConditionPrecedentCategoryList:string[] = ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"];
const ConditionSubsequentCategoryList:string[] = ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"];


const MastersValues = createContext<FieldValues>({
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
});


const Constants = createContext({
  FrequencyList: ["-", "Monthly", "Quarterly", "Half-Yearly", "Yearly"],
  LoanSecuredList: ["-","Secured","Unsecured"],
  YesOrNoList: ["-", "Yes","No"],
  HolidayConventionList: ["-","Precedent","Subsequent","None"],
  InterestTypeList: ["-", "Fixed","Manual"],
});

export  { PermissionContext, MastersValues, Constants } 
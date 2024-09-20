import { FieldValues, MastersValues } from "@/types/DataTypes";
import { ComponentList } from "@/types/ComponentProps";
import { DashboardIcon, LoanIcon , ProductIcon, TransIcon, CompIcon , CovenantIcon, ConditionsIcon, MembersIcon, ManagementIcon, RoleIcon, MastersIcon, ZoneIcon, ScheduleIcon, DefaultIcon, CriticalIcon, /* ReportsIcon,  ReminderIcon */ } from "@/static/PanelIcons";

import Dashboard from '@/components/Dashboard';
import LoanAccount from '@/components/LoanAccount';
import DealsList from '@/components/DealsList';
import UserManagement from '@/components/UserManagement';
import RoleManagement from '@/components/RoleManagement';
import FilterPage from '@/components/FilterPage';
import TeamManagement from '@/components/TeamManagement';
import Masters from '@/components/Masters';
import SpecialCases from '@/components/SpecialCases';
//import Reminders from '@/components/Reminders';
//import Reports from '@/components/Reports';
import _TestComponent from '@/components/_TestComponent';
import UserAssignments from '@/components/UserAssignments';
import TeamTransfer from '@/components/TeamTransfer';


//Keys and URLs
//const ServerUrl = import.meta.env.VITE_APP_SERVER_URL;
const ServerUrl = "http://139.5.190.208:9000";
const apiEndpoint = `${ServerUrl}/api/v1/allAPI`;
const EncryptionKey ="JAIBAJRANGBALI";


const constants = {
  FrequencyList: ["-", "Monthly", "Quarterly", "Half-Yearly", "Yearly"],
  LoanSecuredList: ["-","Secured","Unsecured"],
  YesOrNoList: ["-", "Yes","No"],
  HolidayConventionList: ["-","Precedent","Subsequent","None"],
  InterestTypeList: ["-", "Fixed","Manual"],
}

const statusValues = {
  PriorityList: ["-", "Low", "Medium", "High"] as const,
  UserStatusList: ["-", "Unverified", "Active", "Inactive"] as const,
  TeamStatusList: ["-", "Active", "Inactive"] as const,
  DocumentStatusList: ["-", "Pending", "In progress", "Verified", "Rejected", "Overdue"] as const,
  FileStatusList: ["-", "Pending",  "Verified"] as const,
  LoanStatusList: ["-","Preliminary", "Document", "Live", "Hold", "Cancel"] as const,
}

const statusStyling = {
  PriorityStyling: ["-", "text-green-600 bg-green-100", "text-yellow-600 bg-yellow-50", "text-red-600 bg-red-100"],
  UserStatusStyling: ["-", "text-yellow-600 bg-yellow-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100"],
  TeamStatusStyling: ["-", "text-green-600 bg-green-100", "text-red-600 bg-red-100"],
  DocumentStatusStyling: ["-", "text-yellow-500", "text-blue-500", "text-green-600", "text-red-600"],
  LoanStatusStyling: ["-", "text-yellow-500", "text-blue-500", "text-green-600","text-orange-600", "text-red-800"],
}



const defaultMastersValues:MastersValues = {
  LoanProductList: ["-","Product3","product 4"],
  ZoneList: ["-"],
  FileTypeList: ["-", "PDF", "DOCX", "XLSX", "CSV", "PNG", "JPEG"],
  UserRoleList: ["-"],
  IndustryList: ["-",""],
  LoanTypeList: ["-", "Long Term", "Short Term"],
  DocumentRejectionReasonList: ["-","Document is expired", "Document is incomplete", "Document is irrelevant"],
  TableRowsPerPage: ["-1","2","5","10"],

  ProjectStatusList: ["-","Not Started","In Progress","Finished"],
  DSRAFormList: ["-","LC","BG", "FD"],
  LoanSecurityTypeList: ["-","[PLACEHOLDER DATA] Type A","[PLACEHOLDER DATA] Type B"],
  BankAccountTypeList: ["-", "Saving", "Current"],

  ContactTypeList: ["-", "Borrower", "Lender", "Lender Agent", "Promotor", "Legal Council", "Banks Legal Team", "Lender Insurance Agent", "Lenders Independent Engineer"],
  EmailRecipientList: ["-","To", "Cc","Bcc"],
  RatingAgencyList: ["-", "ICRA", "CRISIL"],
  RatingTypeList: ["-", "Provisional","Final"],
  RatingOutlookList: ["-", "Negative", "Stable", "Positive"],
  TransactionCategoryList: ["-", "Common Loan Agreements","Security Trustee Agreement","Lenders Agent Agreement","Escrow Agreement","Substitution Agreement","Subordination Agreement","Supplementary Escrow Agreement","Sponsors Undertakings","Security documents","Pledge Agreement","Consent to Assignment","Trust and Retention Account Agreement"],
  ComplianceCategoryList: ["-","Common Loan Agreement", "Lenders' Agent Agreement", "Power Purchase Agreement", "Escrow Agreement", "Subordinate Agreement", "Supplementary Escrow Agreement"],
  CovenantCategoryList: ["-", "Financial Covenant","Non-Financial Covenant"],
  CovenantTypeList: ["-", "Periodic", "Event-Based"],
  ConditionPrecedentCategoryList: ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"],
  ConditionSubsequentCategoryList: ["-", "[PLACEHOLDER DATA] Condition A", "[PLACEHOLDER DATA] Condition B"],
}

const adminEnteredMasters:FieldValues = {  
  "-":"-",
  "Zone":"ZoneList",
  "Loan Product":"LoanProductList",
  "File Types":"FileTypeList",
  "Industry":"IndustryList",
  "Loan Types":"LoanTypeList",
  "Security Types":"LoanSecurityTypeList",
  "Transaction Document Categories":"TransactionCategoryList",
  "Compliance Document Categories":"ComplianceCategoryList",
  "Condition Precedent Categories":"ConditionPrecedentCategoryList",
  "Condition Subsequent Categories":"ConditionSubsequentCategoryList",
};

const allSectionPermissions:FieldValues = {
  team: ["access", "add", "edit", "select"],
  user: ["access","add" ,"edit"],
  role: ["access","view","add","edit"],
  masters: ["access","add","edit"],
  loan: ["access", "view", "add", "edit", "delete"],
  contact: ["access","add","view","edit","delete"],
  rating: ["access","add"],
  docs:["access","add","edit"],
  file:["view","add","edit","delete"],
  default:["access","view","edit"],
  critical:["access","view","edit"],
  reminders:["access"],
  reports:["access"],
}


const allComponents:ComponentList = [
  { name: "Dashboard", path:"/", component: Dashboard, icon: DashboardIcon },//0
  { name: "Masters", path:"/masters", component: Masters, icon:MastersIcon },//1
  { name: "Role Management", path:"/roles", component: RoleManagement, icon:RoleIcon },//2
  { name: "User Management", path:"/users", component: UserManagement, icon: ManagementIcon },//3
  { name: "Team Management", path:"/teams", component: TeamManagement, icon: MembersIcon },//4
  { name: "Team Transfer", path:"/transfer", component:TeamTransfer }, //5
  { name: "Loan Account", path:"/loan", component: LoanAccount, icon: LoanIcon },//6
  { name: "Transaction Documents", path:"/transaction", component: DealsList, icon: TransIcon },//7
  { name: "Compliance Documents", path:"/compliance", component: DealsList, icon: CompIcon },//8
  { name: "Covenants", path:"/covenants", component: DealsList, icon: CovenantIcon },//9
  { name: "Condition Precedent", path:"/precedent", component: DealsList, icon: ConditionsIcon },//10
  { name: "Condition Subsequent", path:"/subsequent", component: DealsList, icon: ConditionsIcon },//11
  { name: "Payment Schedule", path:"/schedule", component: DealsList, icon: ScheduleIcon},//12
  { name: "Products", path:"/products", component: FilterPage, icon: ProductIcon },//13
  { name: "Zones", path:"/zones", component: FilterPage, icon: ZoneIcon },//14
  /* { name: "Reminders", path:"/reminders", component: Reminders, icon: ReminderIcon },//15 */
  { name: "Default Cases", path:"/default", component: SpecialCases, icon: DefaultIcon },//15
  { name: "Critical Cases", path:"/critical", component: SpecialCases, icon: CriticalIcon },//16
  /* { name: "Reports", path:"/reports", component: Reports, icon: ReportsIcon },//17 */

  { name: "Master Transaction Documents", path:"/admin/transaction", component: DealsList, icon: TransIcon, panopticPage:true },//18
  { name: "Master Compliance Documents", path:"/admin/compliance", component: DealsList, icon: CompIcon, panopticPage:true },//19
  { name: "Master Covenants", path:"/admin/covenants", component: DealsList, icon: CovenantIcon, panopticPage:true },//20
  { name: "Master Condition Precedent", path:"/admin/precedent", component: DealsList, icon: ConditionsIcon, panopticPage:true },//21
  { name: "Master Condition Subsequent", path:"/admin/subsequent", component: DealsList, icon: ConditionsIcon, panopticPage:true },//22
  { name: "Master Payment Schedule", path:"/admin/schedule", component: DealsList, icon: ScheduleIcon, panopticPage:true },//23
  { name: "Master Default Cases", path:"/admin/default", component:SpecialCases, icon:DefaultIcon, panopticPage:true },//24
  { name: "Master Critical Cases", path:"/admin/critical", component:SpecialCases, icon:CriticalIcon, panopticPage:true },//25

  { name: "User Assignments", path:"/assign", component:UserAssignments},//26

  { name: "Test", path:"/test", component: _TestComponent },//27
];


//"Real Estate","NBFC", "NBFC-MFI", "Bank", "Diversified Conglomerate", "Education", "Healthcare & Pharma", "Hospitality Manufacturing", "Renewable Energy", "Roads", "Commercial Space", "Others"

export { 
  ServerUrl, EncryptionKey, apiEndpoint,
  constants, statusValues, statusStyling,
  defaultMastersValues, adminEnteredMasters,
  allSectionPermissions,
  allComponents,
};
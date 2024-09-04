
import { DocumentStatus, SetStateBoolean, FieldValues } from "@/types/DataTypes";
import { FunctionComponent } from "react";
import { FieldAttributesList } from "./FormAttributes";

type LoanFormMetaData = {okToFrolic?:boolean, AID?:string, loanId?:string, changesHaveBeenMade?:boolean, enableDocumentSections?:boolean};

//FileViewer.tsx
type CommonFileViewerProps = {AID:string, fileName:string, actualName:string, status:DocumentStatus, rejectionReason?:string, setAdded:SetStateBoolean, sectionKeyName:string, setIsDeleted:React.Dispatch<React.SetStateAction<number | undefined>> };
type DocumentFileViewerProps = {type:"doc", loanId:string, docId:string };
type PaymentFileViewerProps = {type:"pay", scheduleId:string, index:number, schedule:FieldValues[] };

//All LoanAccountComponents
type LoanCommonProps = {
  actionType:"CREATE"|"EDIT"|"VIEW", label:string, 
  AID:string, loanId:string,
  currentSection:number, sectionCount:number,
  goToPreviousSection:()=>void, goToNextSection:(info?:LoanFormMetaData)=>void, 
  setOkToFrolic: SetStateBoolean, setUnsavedWarning:SetStateBoolean,
  showSecurityDetails:boolean, setShowSecurityDetails:SetStateBoolean,
  assignedTeam:string,
  preexistingValues:FieldValues,
}

//Outside Components
type ComponentList = {name:string,path:string, component:FunctionComponent<any>, icon?:(props:{fill:string})=>JSX.Element, panopticPage?:boolean}[];

//LoanDocumentComponents
type LoanDocSecProps = {
  data:FieldValues[], label:string, 
  formOpen:boolean[], setFormOpen:React.Dispatch<React.SetStateAction<boolean[]>>, 
  fieldList:FieldAttributesList, 
  editFunction:(userValues:FieldValues, index:number)=>Promise<any>, 
  deleteFunction:()=>void, 
  addFileFunction:(userFiles: any, docId: string) => Promise<number>, 
  deleteFileFunction:(docId: string, fileName: string) => Promise<number>, 
  getFileListFunction:()=>void, 
  setAdded:SetStateBoolean, 
  disableEdit?:boolean
}

export {
  type LoanFormMetaData,
  type CommonFileViewerProps,  type DocumentFileViewerProps,  type PaymentFileViewerProps,
  type LoanCommonProps,
  type ComponentList,
  type LoanDocSecProps,
}
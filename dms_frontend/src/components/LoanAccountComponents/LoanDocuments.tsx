import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FieldValues, FormDialogDocumentSections, FormDialogDocumentTypes, FormFieldDetails } from "../../../DataTypes";

import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import LoanDocumentView from "./LoanDocumentComponents/LoanDocumentView";
import LoanCovenantView from "./LoanDocumentComponents/LoanCovenantView";
import LoanConditionView from "./LoanDocumentComponents/LoanConditionView";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";
import Filter from "../BasicComponents/Filter";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { Toaster } from "../ui/toaster";
import { CovenantTypeList, CovenantCategoryList, FrequencyList, TransactionCategoryList, ComplianceCategoryList, ConditionPrecedentCategoryList, ConditionSubsequentCategoryList } from "../../../Constants";
import { PriorityList } from "../../../StatusLists";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";

function LoanDocuments(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any}) {
  const [docData, setDocData] = useState<FieldValues[]>();

  type SectionDetails = {
    sectionName: FormDialogDocumentSections,
    type:FormDialogDocumentTypes,
    fieldList:FormFieldDetails
  }

  const setSection = (): SectionDetails =>{
    const documentFieldList= (documentOptions:string[]):FormFieldDetails =>{
      return [
        { category:"single", id:"N", name:"Document Name", type:"text", required:true },
        { category:"grid", row:2, fields:[
          { id:"C", name:"Document Category", type:"select", options:documentOptions, required:false, immutable:true },
          { id:"P", name:"Priority", type:"select", options:Object.keys(PriorityList), required:true },
          { id:"SD", name:"Start Date", type:"date", required:true },
          { id:"ED", name:"End Date", type:"date", required:true },
          { id:"PL", name:"Physical Location", type:"text" },
          { id:"EL", name:"Execution Location", type:"text" },
        ]},    
      ]
    }
    
    const covenantFieldList = ():FormFieldDetails => {
      return [
        { category:"grid", row:2, fields:[
          { id:"N", name:"Covenant Name", type:"text", required:true },
          { id:"T", name:"Covenant Type", type:"select", options:CovenantTypeList, required:true },
          { id:"C", name:"Category Type", type:"select", options:CovenantCategoryList, required:true},
          { id:"P", name:"Priority", type:"select", options:Object.keys(PriorityList), required:true},
        ]},
        { category:"single", id:"F", name:"Frequency", type:"select", options:FrequencyList },
        { category:"grid", row:2, fields:[  
          { id:"SD", name:"Start Date", type:"date", required:true },
          { id:"ED", name:"End Date", type:"date", required:true },
          { id:"EL", name:"Execution Location", type:"text" },
          { id:"PL", name:"Physical Location", type:"text" },
        ]},
        { category:"single", id:"D", name:"Description", type:"textarea" },
      ];
    }

    const conditionsFieldList = (documentOptions:string[]):FormFieldDetails => {
      return [
        { category:"single", id:"N", name:"Condition Name", type:"text" },
        { category:"grid", row:2, fields:[
          { id:"C", name:"Condition Category", type:"select", options:documentOptions },
          { id:"P", name: "Priority", type:"select", options:Object.keys(PriorityList)},
          { id:"SD", name:"Start Date", type:"date", required:true },
          { id:"ED", name:"End Date", type:"date", required:true },
          { id:"PL", name:"Physical Location", type:"text" },
          { id:"EL", name:"Execution Location", type:"text" },
        ]},
        { category:"single", id:"D", name:"Description", type:"textarea" },
      ]
    }

    if (props.label=="Transaction Documents")
      return { sectionName: "TD", type:"doc", fieldList: documentFieldList(TransactionCategoryList) }
    
    else if (props.label=="Compliance Documents")
      return { sectionName: "CD", type:"doc", fieldList: documentFieldList(ComplianceCategoryList) }
    
    else if (props.label=="Covenants")
      return { sectionName: "C", type:"cov", fieldList: covenantFieldList() }
    
    else if (props.label=="Condition Precedent")
      return { sectionName: "CP", type:"con", fieldList: conditionsFieldList(ConditionPrecedentCategoryList) }
    
    else if (props.label=="Condition Subsequent")
      return { sectionName: "CS", type:"con",fieldList: conditionsFieldList(ConditionSubsequentCategoryList) }
    
    else 
      return { sectionName: "undefined", type:"undefined", fieldList: [] }
  }
  
  const [sectionDetails] = useState(setSection());
  const [added, setAdded] = useState(true);
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [fileList, setFileList] = useState<any>([]);
  const [priority, setPriority] = useState(CovenantTypeList[1]);
  
  const [uploadField] = useState(
    { id: "Docs", name:"Document Upload", fileList: fileList }
  );

  useEffect(()=>{
    if (added){
      getDocumentsList().then(res=>{
        setDocData(res);
      })
      setAdded(false);
    }
  },[added]);

  const getDocumentsList = async () =>{
    const { getDocumentsList } = useGlobalContext();

    const res = await getDocumentsList(props.loanId,sectionDetails.sectionName);
    console.log("REPSONE",res)

    if (res.status==200)
      return await res.obj;
    else 
      return [];
  }

  const addDocument = async (userValues:any) =>{
    const { addDocument } = useGlobalContext();

    userValues["_loanId"] = props.loanId;
    userValues["SN"] = sectionDetails.sectionName;
    console.log("FINAL SUBMIT")
    const res = await addDocument(userValues);
  
    if (res.status==200){
      setAdded(true);
      setFieldValues({});
    }
    return res;
  }

  const editDocument = async (userValues:any,currIndex:number) => {
    const { addDocument } = useGlobalContext();

    userValues["_id"] = currIndex;
    userValues["SN"] = sectionDetails.sectionName; 
  
   const res = await addDocument(userValues);
  
    if (res.status==200){
      setAdded(true);
      setFieldValues({});
    }
    return res;
  }

  const addFile = async (userFiles:any, docId:string) => {
    const { uploadFile } = useGlobalContext();

    const formData = new FormData();
    
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i][0]);
    
    const res = await uploadFile(formData, `${props.AID}/${sectionDetails.sectionName}`,docId);
    
    return res;
  }

  const deleteFile = async (docId:string,fileName:string) => {
    const { deleteDocument } = useGlobalContext();

    console.log("DELETE",props.AID,docId, fileName,sectionDetails.sectionName)

    const res = await deleteDocument(props.AID, docId, sectionDetails.sectionName, fileName);
    return res;
  }

  const deleteDocument = () => {
  }

  const getFileList = async () => {
  }

  return (
    <div className="bg-white rounded-xl">
      <br/>
      <Toaster/>
      <div className="flex flex-row">
        <div className="flex-auto">
          {sectionDetails.type=="doc"
            ?<></>
            :sectionDetails.type=="cov"
              ?<Filter setter={setPriority} valueList={CovenantTypeList}/>
              :<></>
          }
        </div>
      
        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type={sectionDetails.type}
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} formTitle={props.label} 
            detailSubmit={addDocument} fileSubmit={addFile} deleteFile={deleteFile} getFiles={getFileList}
            detailForm={sectionDetails.fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setFileList} fileList={fileList}
            currentFields={{}}
          />
        </div>
      </div> 
      <div className="m-5">
        {docData
          ?docData.length==0?<EmptyPageMessage sectionName="documents" />
          :sectionDetails.type=="doc"
            ?<LoanDocumentView docData={docData} label={props.label} 
              fieldList={sectionDetails.fieldList} uploadField={uploadField} fieldValues={fieldValues} setFieldValues={setFieldValues} fileList={fileList} setFileList={setFileList}
              editDocumentFunction={editDocument} deleteDocumentFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
            />
            :sectionDetails.type=="cov"
              ?<LoanCovenantView covData={docData} label={props.label} priority={priority}
                fieldList={sectionDetails.fieldList} uploadField={uploadField} fieldValues={fieldValues} setFieldValues={setFieldValues} fileList={fileList} setFileList={setFileList}
                editCovenantFunction={editDocument} deleteCovenantFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
              />
              :<LoanConditionView conData={docData} label={props.label}
                fieldList={sectionDetails.fieldList} uploadField={uploadField} fieldValues={fieldValues} setFieldValues={setFieldValues} fileList={fileList} setFileList={setFileList}
                editConditionFunction={editDocument} deleteConditionFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
              />
          :<LoadingMessage sectionName="list" />
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
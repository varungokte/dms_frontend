import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FieldValues, LoanCommonProps } from "../../../DataTypes";

import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import LoanDocumentView from "./LoanDocumentComponents/LoanDocumentView";
import LoanCovenantView from "./LoanDocumentComponents/LoanCovenantView";
import LoanConditionView from "./LoanDocumentComponents/LoanConditionView";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";
import Filter from "../BasicComponents/Filter";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { Toaster } from "../ui/toaster";
import { CovenantTypeList } from "../../../Constants";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import setSection from "./LoanDocumentComponents/LoanDocSectionDetails";

function LoanDocuments(props:LoanCommonProps) {
  const [docData, setDocData] = useState<FieldValues[]>();
  
  const [sectionDetails] = useState(setSection(props.label));
  const [added, setAdded] = useState(true);
  const [covenantType, setCovenantType] = useState(CovenantTypeList[1]);

  useEffect(()=>{
    if (added)
      getDocumentsList().then(res=>{
        //console.log("rsponse",res)
        setDocData(res);
        setAdded(false);
      })
  },[added]);

  const getDocumentsList = async () =>{
    const { getDocumentsList } = useGlobalContext();

    const res = await getDocumentsList(props.loanId,sectionDetails.sectionName);
    
    if (res.status==200)
      return await res.obj;
    else 
      return [];
  }

  const addDocument = async (userValues:any) =>{
    const { addDocument } = useGlobalContext();

    userValues["_loanId"] = props.loanId;
    userValues["SN"] = sectionDetails.sectionName;
    //console.log("userValues",userValues)
    const res = await addDocument(userValues);

    if (res.status==200)
      setAdded(true);
    return res;
  
  }

  const editDocument = async (userValues:any) => {
    const { editDocument } = useGlobalContext();
    if (!docData)
      return;
    /* console.log("userValues",userValues,currIndex)
    const newValues = Object.keys(userValues);
    const oldValues = Object.keys(docData[currIndex]);
    const data:FieldValues={};
    for (let i=0; i<oldValues.length; i++){
      if (oldValues[i] && docData[currIndex][oldValues[i]]==userValues[newValues[i]])
      continue;
      data[newValues[i]] = userValues[newValues[i]];
    } */
    userValues["SN"] = sectionDetails.sectionName;  
    
    const res = await editDocument(userValues);
  
    if (res.status==200)
      setAdded(true);
    return res;
  }

  const addFile = async (userFiles:any, docId:string) => {
    const { uploadFile } = useGlobalContext();
    const formData = new FormData();

    //console.log("userFiles",userFiles);
    
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i]);
    
    const res = await uploadFile(formData, `${props.AID}/${sectionDetails.sectionName}`,docId);
    
    return res;
  }

  const deleteFile = async (docId:string,fileName:string) => {
    const { deleteDocument } = useGlobalContext();

    //console.log("DELETE",props.AID,docId, fileName,sectionDetails.sectionName)

    const res = await deleteDocument(props.AID, docId, sectionDetails.sectionName, fileName);
    return res;
  }

  const deleteDocument = () => {}

  const getFileList = async () => {}

  return (
    <div className="bg-white rounded-xl">
      <br/>
      <Toaster/>
      <div className="flex flex-row">
        <div className="flex-auto">
          {sectionDetails.sectionType=="doc"
            ?<></>
            :sectionDetails.sectionType=="cov"
              ?<Filter value={covenantType} setValue={setCovenantType} options={CovenantTypeList}/>
              :<></>
          }
        </div>
      
        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type={sectionDetails.sectionType}
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} titleText={props.label} 
            detailSubmit={addDocument} fileSubmit={addFile} deleteFile={deleteFile} getFiles={getFileList}
            formFields={sectionDetails.fieldList}currentFields={{}} setAdded={setAdded}
          />
        </div>
      </div> 
      <div className="m-5">
        {docData
          ?docData.length==0?<EmptyPageMessage sectionName="documents" />
          :sectionDetails.sectionType=="doc"
            ?<LoanDocumentView docData={docData} label={props.label} fieldList={sectionDetails.fieldList}
              editDocumentFunction={editDocument} deleteDocumentFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
            />
            :sectionDetails.sectionType=="cov"
              ?<LoanCovenantView covData={docData} label={props.label} type={covenantType} fieldList={sectionDetails.fieldList}
                editCovenantFunction={editDocument} deleteCovenantFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
              />
              :<LoanConditionView conData={docData} label={props.label} fieldList={sectionDetails.fieldList}
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
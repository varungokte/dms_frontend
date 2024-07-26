import { useContext, useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FieldValues, LoanCommonProps, ToastOptionsAttributes } from "../../../DataTypes";

import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import LoanDocumentView from "./LoanDocumentComponents/LoanDocumentView";
import LoanCovenantView from "./LoanDocumentComponents/LoanCovenantView";
import LoanConditionView from "./LoanDocumentComponents/LoanConditionView";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";
import Filter from "../BasicComponents/Filter";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { CovenantTypeList, sectionNames } from "../../../Constants";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import setSection from "./LoanDocumentComponents/LoanDocSectionDetails";
import { PermissionContext } from "@/MenuRouter";
import Toast from "../BasicComponents/Toast";
import { Pagination } from "../BasicComponents/Pagination";

function LoanDocuments(props:LoanCommonProps) {
  const [docData, setDocData] = useState<FieldValues[]>();
  
  const sectionDetails = setSection(props.label);
  const [added, setAdded] = useState(true);
  const [covenantType, setCovenantType] = useState(CovenantTypeList[1]);

  const {userPermissions} = useContext(PermissionContext);

  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

  useEffect(()=>{
    if (added){
      getDocumentsList().then(res=>{
        console.log("response",res);
        setDocData(res);
      })
      setAdded(false);
    }
  },[added]);

  const getDocumentsList = async () =>{
    const { getDocumentsList } = useGlobalContext();

    const res = await getDocumentsList({loanId:props.loanId,sectionName:sectionDetails.sectionName, currentPage, rowsPerPage});
    
    if (res.status==200 && res.obj){
      if (res.obj[0] && res.obj["metadata"] && res.obj["metadata"][0] && res.obj["metadata"][0]["total"])
        setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
      return await res.obj[0]["data"];
    }
    else 
      return [];
  }

  const addDocument = async (userValues:any) =>{
    const { addDocument } = useGlobalContext();

    userValues["_loanId"] = props.loanId;
    userValues["SN"] = sectionDetails.sectionName;
    //console.log("userValues",userValues)
    const res = await addDocument(userValues);

    if (res.status==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Document"});
    }
    return res;  
  }

  const editDocument = async (userValues:any,index:number) => {
    const { editDocument } = useGlobalContext();
    if (!docData)
      return;
    console.log("userValues",userValues);
    console.log("fieldValues",docData[index]);

    const data:FieldValues = {};
    data["SN"] = sectionDetails.sectionName;  
    data["_loanId"] = userValues["_loanId"];
    data["_id"] = userValues["_id"];

    for (let i=0; i<Object.keys(userValues).length; i++){
      const key = Object.keys(userValues)[i]
      const oldValue = docData[index][key];
      const newValue = userValues[key];

      if (oldValue!=newValue)
        data[key] = newValue;
    }

    console.log("data",data)

    //console.log("USER VALUES",userValues);
    
    const res = await editDocument(data);
  
    if (res.status==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"edit", section:"Document details"});
    }
    return res;
  }

  const addFile = async (userFiles:any, docId:string) => {
    const { uploadFile } = useGlobalContext();
    const formData = new FormData();

    //console.log("userFiles",userFiles);
    
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i]);
    
    const res = await uploadFile(formData, `${props.AID}/${sectionDetails.sectionName}`,docId);
    if (res==200)
      setToastOptions({open:true, type:"success", action:"add", section:"file"});
    
    return res;
  }

  const deleteFile = async (docId:string,fileName:string) => {
    const { deleteDocument } = useGlobalContext();

    //console.log("DELETE",props.AID,docId, fileName,sectionDetails.sectionName)

    const res = await deleteDocument(props.AID, docId, sectionDetails.sectionName, fileName);

    if (res==200)
      setToastOptions({open:true, type:"success", action:"delete", section:"file"});
    else
      setToastOptions({open:true, type:"error", action:"delete", section:"file"});
    return res;
  }

  const deleteDocument = () => {}

  const getFileList = async () => {}

  return (
    <div className="bg-white rounded-xl">
      <br/>
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
          {props.actionType!="VIEW" && userPermissions[sectionNames[props.label]] && userPermissions[sectionNames[props.label]]["docs"] && userPermissions[sectionNames[props.label]]["docs"].includes("add")
            ?<FormDialogDocuments key={-5} index={-5} edit={false} type={sectionDetails.sectionType}
              triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} titleText={props.label} 
              detailSubmit={addDocument} fileSubmit={addFile} deleteFile={deleteFile} getFiles={getFileList}
              formFields={sectionDetails.fieldList}currentFields={{}} setAdded={setAdded}
            />
            :<></>
          }
        </div>
      </div> 
      <div className="m-5">
        {docData
          ?docData.length==0?<EmptyPageMessage sectionName="documents" />
          :sectionDetails.sectionType=="doc"
            ?<LoanDocumentView docData={docData} label={props.label} fieldList={sectionDetails.fieldList}
              editDocumentFunction={editDocument} deleteDocumentFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
              setAdded={setAdded} disableEdit={props.actionType=="VIEW"}
            />
            :sectionDetails.sectionType=="cov"
              ?<LoanCovenantView covData={docData} label={props.label} type={covenantType} fieldList={sectionDetails.fieldList}
                editCovenantFunction={editDocument} deleteCovenantFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
                setAdded={setAdded} disableEdit={props.actionType=="VIEW"}
              />
              :<LoanConditionView conData={docData} label={props.label} fieldList={sectionDetails.fieldList}
                editConditionFunction={editDocument} deleteConditionFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
                setAdded={setAdded} disableEdit={props.actionType=="VIEW"}
              />
          :<LoadingMessage sectionName="list" />
        }
      </div>
      {docData && docData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} sectionCount={props.sectionCount} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
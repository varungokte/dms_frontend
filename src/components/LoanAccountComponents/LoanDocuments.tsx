import { useContext, useEffect, useState } from "react";
import useGlobalContext from "@/functions/GlobalContext";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { LoanCommonProps } from "@/types/ComponentProps";

import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import LoanDocumentView from "./LoanDocumentComponents/LoanDocumentView";
import LoanCovenantView from "./LoanDocumentComponents/LoanCovenantView";
import LoanConditionView from "./LoanDocumentComponents/LoanConditionView";
import EmptyPageMessage from "../BasicMessages/EmptyPageMessage";
import LoadingMessage from "../BasicMessages/LoadingMessage";
import Filter from "../BasicComponents/Filter";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { CovenantTypeList, sectionNames } from "../../functions/Constants";
import setSection from "./LoanDocumentComponents/LoanDocSectionDetails";
import { PermissionContext } from "@/MenuRouter";
import Toast from "../BasicComponents/Toast";
import { Pagination } from "../BasicComponents/Pagination";
import SearchByType from "../BasicComponents/SearchByType";
import AddButton from "../BasicButtons/AddButton";

function LoanDocuments(props:LoanCommonProps) {
  const [docData, setDocData] = useState<FieldValues[]>();
  
  const sectionDetails = setSection(props.label);
 
  const [addOpen, setAddOpen] = useState([false]);
  const [editOpen, setEditOpen] = useState<boolean[]>([]);
  const [added, setAdded] = useState(true);
  const [covenantType, setCovenantType] = useState(CovenantTypeList[1]);

  const {userPermissions} = useContext(PermissionContext);

  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const searchOptions = [{label:"Document Name", value:"N"}, {label:"Document Category", value:"C"}/* , {label:"Status", value:"C"} */];

  //useEffect(()=>console.log("editOpen",editOpen),[editOpen])

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage,searchString,searchType]);

  useEffect(()=>{
    if (added){
      getDocumentsList().then(res=>{
        //console.log("response",res);
        setDocData(res);
      })
      setAdded(false);
    }
  },[added]);

  const getDocumentsList = async () =>{
    const { getDocumentsList } = useGlobalContext();

    const res = await getDocumentsList({loanId:props.loanId,sectionName:sectionDetails.sectionKeyName, currentPage, rowsPerPage, searchString, searchType});
    
    if (res.status==200){
      if (!res.obj || !res.obj[0] || !res.obj[0]["data"])
        return [];
      
      if (editOpen.length==0)
        setEditOpen(new Array(res.obj[0]["data"].length).fill(false));
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
    userValues["SN"] = sectionDetails.sectionKeyName;
    //console.log("userValues",userValues)
    const res = await addDocument(userValues);

    if (res.status==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Document"});
    }
    return res;  
  }

  const editDocument = async (userValues:FieldValues,index:number) => {
    const { editDocument } = useGlobalContext();
    if (!docData)
      return;

    const data:FieldValues = {};
    data["SN"] = sectionDetails.sectionKeyName;  
    data["_loanId"] = userValues["_loanId"];
    data["_id"] = userValues["_id"];

    for (let i=0; i<Object.keys(userValues).length; i++){
      const key = Object.keys(userValues)[i]
      const oldValue = docData[index][key];
      const newValue = userValues[key];

      if (oldValue!=newValue)
        data[key] = newValue;
    }

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
    
    const res = await uploadFile({data:formData,AID:props.AID,sectionKeyName:sectionDetails.sectionKeyName,docId:docId});
    if (res==200)
      setToastOptions({open:true, type:"success", action:"add", section:"File"});
    
    return res;
  }

  const deleteFile = async (docId:string,fileName:string) => {
    const { deleteDocument } = useGlobalContext();

    //console.log("DELETE",props.AID,docId, fileName,sectionDetails.sectionName)

    const res = await deleteDocument({AID:props.AID, docId:docId, sectionKeyName:sectionDetails.sectionKeyName, fileName:fileName});

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
        <div className="m-auto">
        <SearchByType className="mx-7" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
        </div>
        <div className="m-auto flex-auto">
          {sectionDetails.sectionType=="document"
            ?<></>
            :sectionDetails.sectionType=="covenant"
              ?<Filter value={covenantType} setValue={setCovenantType} options={CovenantTypeList}/>
              :<></>
          }
        </div>
      
        <div className="mr-3">
          {props.actionType!="VIEW" && userPermissions[sectionNames[props.label]] && userPermissions[sectionNames[props.label]]["docs"] && userPermissions[sectionNames[props.label]]["docs"].includes("add")
            ?<div>
              <AddButton sectionName={sectionDetails.sectionType} onClick={()=>setAddOpen([true])} />
              {addOpen[0]
                ?<FormDialogDocuments key={-5} index={0} edit={false} type={sectionDetails.sectionType}
                  formOpen={addOpen[0]} setFormOpen={setAddOpen} formTitle={props.label} formSize="md"
                  detailSubmit={addDocument} fileSubmit={addFile} deleteFile={deleteFile} getFiles={getFileList}
                  formFields={sectionDetails.fieldList}currentFields={{}} setAdded={setAdded}
                />
                :<></>
              }
            </div>
            :<></>
          }
        </div>
      </div> 
      <div className="m-5">
        {docData
          ?docData.length==0?<EmptyPageMessage sectionName="documents" />
          :sectionDetails.sectionType=="document"
            ?<LoanDocumentView data={docData} label={props.label} fieldList={sectionDetails.fieldList} 
              formOpen={editOpen} setFormOpen={setEditOpen}
              editFunction={editDocument} deleteFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
              setAdded={setAdded} disableEdit={props.actionType=="VIEW"}
            />
            :sectionDetails.sectionType=="covenant"
              ?<LoanCovenantView data={docData} label={props.label} type={covenantType} fieldList={sectionDetails.fieldList}
                formOpen={editOpen} setFormOpen={setEditOpen}
                editFunction={editDocument} deleteFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
                setAdded={setAdded} disableEdit={props.actionType=="VIEW"}
              />
              :<LoanConditionView data={docData} label={props.label} fieldList={sectionDetails.fieldList}
                formOpen={editOpen} setFormOpen={setEditOpen}
                editFunction={editDocument} deleteFunction={deleteDocument} addFileFunction={addFile} deleteFileFunction={deleteFile} getFileListFunction={getFileList}
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
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
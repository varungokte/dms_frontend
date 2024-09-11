import { useEffect, useState } from "react";
import { FieldValues} from "@/types/DataTypes";
import { FormDialogDocumentsProps } from "@/types/FormComponentProps";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import SubmitButton from "../BasicButtons/SubmitButton";
import FileField from "../FormFieldComponents/FileField";
import FormFieldsRender from "./FormFieldsRender";
import CloseIcon from '@mui/icons-material/Close';
import CancelButton from "../BasicButtons/CancelButton";

//{currentTab=="details"?"Next":"Save"}

function FormDialogDocuments(props:FormDialogDocumentsProps){
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [fileList, setFileList] = useState<any>([]);

  const [errorMessage, setErrorMessage] = useState(<></>);
  const [errorList, setErrorList] = useState<string[]>([]);

  const [currentTab, setCurrentTab] = useState("details");
  const [enableUpload, setEnableUpload] = useState(false);
  
  const [covType, setCovType]= useState("");
  const [docId, setDocId] = useState("");
  const [receivedFilesFromServer, setReceivedFilesFromServer] = useState(false);

  useEffect(()=>{
    if (!props.formOpen){
      setPrefillValues({});
      setFileList([]);
      setEnableUpload(false);
    }
  },[props.formOpen]);

  //useEffect(()=>console.log(props.index,"fileList", fileList),[fileList]);

  useEffect(()=>{
    if (!props.formOpen)
      return;

    if (props.edit){
      if (props.currentFields["FD"]){
        setFileList(props.currentFields["FD"]);
        console.log("props.currentFIelds[FD]",props.currentFields);
        setReceivedFilesFromServer(true);
      }

      setDocId(props.currentFields["_id"]||"")
      setPrefillValues({...props.currentFields});
      setEnableUpload(true);
    }
    else
      setPrefillValues({...props.currentFields});
  },[props.currentFields,props.formOpen]);


  useEffect(()=>{
    setCurrentTab("details");
  },[props.formOpen]);
  
  const checkForChanges = () => {
    if (currentTab=="upload"){
      if (fileList && fileList.length>0 && prefillValues["FD"] && prefillValues["FD"][0].filename==fileList[0].filename)
        return false;
      else
        return true;
    }

    if (Object.keys(prefillValues).length==0)
      return true;
    
    for (let i=0;i<Object.keys(prefillValues).length;i++){
      const key = Object.keys(prefillValues)[i];
      const value = prefillValues[key];
      if (value && props.currentFields[key]!=value)
        return true;
    }
    return false;
  }

  const validateRequiredFields = ()=>{
    const data:any={};
    const arr=[];

    for (let i=0; i<props.formFields.length; i++){
      const field = props.formFields[i];

      if (field.category=="single")
        data[field.id] = field["required"]?true:false;
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = gridField["required"]?true:false;
        }
      }
    }

    for (let i=0;i<Object.keys(data).length;i++){
      const key = Object.keys(data)[i];
      const value = data[key];  
      if (value && (!(Object.keys(prefillValues).includes(key)) || prefillValues[key]=="" || prefillValues[key]==-1))
        arr.push(key);
    }
    
    if (arr.length>0){
      setErrorList(arr);
      setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>)
      return false;

    }
    else{
      setErrorMessage(<></>);
      return true;
    }
  }

  const closeDialog = () => {
    props.setFormOpen(curr=>{
      curr[props.index]=false; 
      return [...curr];
    });
  }
  
  const submitDetails = async () => {
    const changesHaveBeenMade = checkForChanges();
    if (!changesHaveBeenMade){
      setEnableUpload(true);
      setCurrentTab("upload");
      return true;
    }

    const valid = validateRequiredFields();
    if (!valid)
      return false;
    
    let res = await props.detailSubmit({...prefillValues},props.currIndex);
    
    if (res.status==200){
      setEnableUpload(true);
      setCurrentTab("upload");
      setErrorMessage(<></>);
      console.log("doc",res);
      if (res["id"]!="")
        setDocId(res["id"]);
      return true;
    }
    else if (res.status==422){
      setErrorMessage(<p className="text-red-600">The Category name is taken. Please enter another one.</p>)
      return false;
    }
    else {
      setErrorMessage(<p className="text-yellow-600">Something went wrong. Please try again later.</p>)
      return false;
    }
  } 

  const submitFile = async () => {
    if (!fileList || fileList.length==0){
      closeDialog();
      props.setAdded(true);
      return;
    }
    const changesHaveBeenMade = checkForChanges();
    if (!changesHaveBeenMade){
      closeDialog()
      return;
    }
    console.log("fileList",fileList, "docId",docId)
    const res = await props.fileSubmit(fileList,docId);
    
    if (res==200){
      setErrorMessage(<></>);
      props.setAdded(true);
      closeDialog();
    }
    else
      setErrorMessage(<p className="text-yellow-600">Something went wrong. Please try again later.</p>)
  }

  return(
    <Dialog open={props.formOpen} onClose={closeDialog} maxWidth={props.formSize} fullWidth>
      <DialogTitle>
        <div className="flex flex-row">
          <div className="flex-auto"><p className="text-2xl font-normal">{props.formTitle}</p></div>
          <div><button onClick={closeDialog}><CloseIcon/></button></div>
        </div>
      </DialogTitle>
      <hr/>
      <div>
        <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue={"details"} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2 border-0">
            <TabsTrigger value="details" className="h-10 ">Document Details</TabsTrigger>
            <TabsTrigger value="upload" className="h-10" disabled={!enableUpload}>File Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="h-full border-0" style={{overflowY:"auto"}}>
            <Card className="border-0">
              <CardContent className="mt-5" style={{borderWidth:"0px", borderColor:"white"}}>
                <form >
                  <FormFieldsRender form={props.formFields} formType="docs" prefillValues={prefillValues} setPrefillValues={setPrefillValues} edit={props.edit} covType={covType} setCovType={setCovType} sectionType={props.type} errorList={errorList} />
                  {errorMessage}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card className="mt-5" style={{borderWidth:"0px", borderColor:"white"}}>
              <CardContent className="border-0">
                <FileField key={100} index={100} fileList={fileList} fileSetter={setFileList} edit={props.edit} prefillValues={prefillValues} docId={docId} deleteFile={props.deleteFile} receivedFilesFromServer={receivedFilesFromServer} setReceivedFilesFromServer={setReceivedFilesFromServer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <br/>
        <div className="flex flex-row m-3">
          <div className="flex-auto"></div>
          <CancelButton onClick={closeDialog} />
          <SubmitButton submitFunction={currentTab=="details"?submitDetails:submitFile} submitButtonText={currentTab=="details"?"Next":"Save"} />
        </div>
        <br />
      </div>
    </Dialog>  
  )
};
    
export default FormDialogDocuments;

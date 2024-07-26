import { ReactElement, useEffect, useState } from "react";
import { DocumentSectionTypes, FieldAttributesList, FieldValues} from "./../../../DataTypes";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButtonStyling } from "../BasicComponents/PurpleButtonStyling";

import SubmitButton from "../BasicComponents/SubmitButton";
import FileField from "../FormFieldComponents/FileField";
import FormFieldsRender from "./FormFieldsRender";

type FormDialogDocumentsProps = {
  index:number, type:DocumentSectionTypes, edit:boolean,
  triggerText:string|ReactElement, triggerClassName:string, titleText:string,
  currentFields:FieldValues,
  detailSubmit:Function, fileSubmit:Function, deleteFile:Function, getFiles:Function, 
  formFields:FieldAttributesList, 
  currIndex?:number,
  setAdded:Function,
}

//{currentTab=="details"?"Next":"Save"}

function FormDialogDocuments(props:FormDialogDocumentsProps){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [fileList, setFileList] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [currentTab, setCurrentTab] = useState("details");
  const [enableUpload, setEnableUpload] = useState(false);
  const [covType, setCovType]= useState("");
  const [docId, setDocId] = useState("");
  const [receivedFilesFromServer, setReceivedFilesFromServer] = useState(false);

  useEffect(()=>{
    if (!open){
      setPrefillValues({});
      setFileList([]);
      setEnableUpload(false);
    }
  },[open]);

  //useEffect(()=>console.log(props.index,"fileList", fileList),[fileList]);

  useEffect(()=>{
    if (!open)
      return;

    if (props.edit){
      if (props.currentFields["FD"]){
        setFileList(props.currentFields["FD"]);
        setReceivedFilesFromServer(true);
      }

      setDocId(props.currentFields["_id"]||"")
      setPrefillValues({...props.currentFields});
      setEnableUpload(true);
    }
    else
      setPrefillValues({...props.currentFields});
  },[props.currentFields,open]);


  useEffect(()=>{
    setCurrentTab("details");
  },[open]);
  
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
      if (value && (!(Object.keys(prefillValues).includes(key)) || prefillValues[key]=="" || prefillValues[key]==-1)){
        setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>)
        return false;
      }
    }
    return true;
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
      setOpen(false);
      props.setAdded(true);
      return;
    }

    const changesHaveBeenMade = checkForChanges();
    if (!changesHaveBeenMade){
      setOpen(false);
      return;
    }

    const res = await props.fileSubmit(fileList,docId);
    
    if (res==200){
      setErrorMessage(<></>);
      console.log("have submitted",fileList);
      props.setAdded(true);
      setOpen(false);
    }
    else
      setErrorMessage(<p className="text-yellow-600">Something went wrong. Please try again later.</p>)
  }

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={props.triggerClassName}>{props.triggerText}</AlertDialogTrigger>
      <AlertDialogContent className={`bg-white overflow-y-auto max-h-screen min-w-[800px]`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-normal">{props.titleText}</AlertDialogTitle>
          <hr/>
        </AlertDialogHeader>
        <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue={"details"} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2 border-0">
            <TabsTrigger value="details" className="h-10 ">Document Details</TabsTrigger>
            <TabsTrigger value="upload" className="h-10" disabled={!enableUpload}>File Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="h-full border-0" style={{overflowY:"auto"}}>
            <Card className="border-0">
              <CardContent className="mt-5"  style={{borderWidth:"0px", borderColor:"white"}}>
                <form onSubmit={(e)=>{props.detailSubmit(e);}}>
                  <FormFieldsRender form={props.formFields} formType="docs" prefillValues={prefillValues} setPrefillValues={setPrefillValues} edit={props.edit} covType={covType} setCovType={setCovType} sectionType={props.type}  />
                  {errorMessage}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card className="mt-5" style={{borderWidth:"0px", borderColor:"white"}}>
              <CardContent className="border-0">
                <FileField key={100} index={100} fileList={fileList} fileSetter={setFileList} validateRequiredFields={validateRequiredFields} formSubmit={props.fileSubmit} edit={props.edit} prefillValues={prefillValues} docId={docId} deleteFile={props.deleteFile} receivedFilesFromServer={receivedFilesFromServer} setReceivedFilesFromServer={setReceivedFilesFromServer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <br/>
        <br/>
        <AlertDialogFooter className="bottom-0 h-12">
          <AlertDialogCancel className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</AlertDialogCancel>
          <SubmitButton className={SubmitButtonStyling} submitFunction={currentTab=="details"?submitDetails:submitFile} submitButtonText={currentTab=="details"?"Next":"Save"} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>  
  )
};
    
export default FormDialogDocuments;

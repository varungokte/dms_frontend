import { ReactElement, useEffect, useState } from "react";
//import useGlobalContext from "./../../../GlobalContext";
import { DocumentSectionTypes, FieldAttributesList, FieldValues} from "./../../../DataTypes";
import { CovenantTypeList, FileTypeList } from "../../../Constants";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {useDropzone} from "react-dropzone";
import { Upload } from "lucide-react";
import { LinearProgress } from "@mui/material";
import { SubmitButtonStyling } from "../BasicComponents/PurpleButtonStyling";

import SelectField from "../FormFieldComponents/SelectField";
import TextAreaField from "../FormFieldComponents/TextAreaField";
import DateField from "../FormFieldComponents/DateField";
import TextField from "../FormFieldComponents/TextField";
import Close from "@mui/icons-material/Close";

type FormDialogDocumentsProps = {
  index:number, type:DocumentSectionTypes, edit:boolean,
  triggerText:string|ReactElement, triggerClassName:string, titleText:string,
  currentFields:FieldValues, 
  detailSubmit:Function, fileSubmit:Function, deleteFile:Function, getFiles:Function, 
  formFields:FieldAttributesList, 
  currIndex?:number
}

function FormDialogDocuments(props:FormDialogDocumentsProps){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<FieldValues>({});
  const [fileList, setFileList] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [currentTab, setCurrentTab] = useState("details");
  const [fileType, setFileType] = useState(-1);
  const [covType, setCovType]= useState("");
  const [enableUpload, setEnableUpload] = useState(false);
  const [docId, setDocId] = useState("");
  const [recievedFilesFromServer, setRecievedFilesFromServer] = useState(false);

  useEffect(()=>{
    if (props.edit){
      if (props.currentFields["FD"]){
        setFileList(props.currentFields["FD"])
        setRecievedFilesFromServer(true);
      }

      setDocId(props.currentFields["_id"]||"")
      setPrefillValues(props.currentFields);
      setEnableUpload(true);
    }
    else
      setPrefillValues(props.currentFields);
  },[props.currentFields]);


  useEffect(()=>{
    setCurrentTab("details");
  },[open])

  const validateRequiredFields = async()=>{
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
    setErrorMessage(<span><LinearProgress /></span>);
    return true;
  }

  const submitDetails = async () => {
    const valid = validateRequiredFields();
    if (!valid)
      return false;
    let res = await props.detailSubmit(prefillValues, props.currIndex);
    
    
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
      return;
    }
    
    const res = await props.fileSubmit(fileList,docId);
    if (res==200){
      setErrorMessage(<></>);
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
            <TabsTrigger value="details" className="h-10">Document Details</TabsTrigger>
            <TabsTrigger value="upload" className="h-10" disabled={!enableUpload}>File Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="h-full border-0" style={{overflowY:"auto"}}>
            <Card className="border-0">
              <CardContent className="mt-5"  style={{borderWidth:"0px", borderColor:"white"}}>
                <form onSubmit={(e)=>{props.detailSubmit(e);}}>
                  {props.formFields.map((field:any,index:number)=>{
                    if (field["category"]=="single"){
                      if (field["id"]=="F" && covType!==CovenantTypeList[1])
                        return null;
                      if (field["type"]=="select")
                        return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} 
                          options={field["options"]} 
                          required={field["required"]?true:false} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
                          prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                          setFileType={setFileType} setCovType={setCovType} sectionType={props.type} 
                        />
                      else if (field["type"]=="textarea")
                        return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} 
                          required={field["required"]?true:false} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
                          prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                        />
                      else if (field["type"]=="date")
                        return <DateField key={index} index={index} id={field["id"]} name={field["name"]} 
                          required={field["required"]?true:false} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
                          prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                        />
                      else
                        return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]} 
                          required={field["required"]?true:false} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
                          prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                        />
                    }
                    else if (field["category"]=="grid"){
                      return(
                        <div key={index+"grid"}>
                          <div key={index+"grid name"} className="text-2xl font-medium my-2">{field["sectionName"]}</div>
                          <div key={index+"gridz"} className={`grid grid-cols-${field["row"]}`}>
                            {field.fields.map((item:any, itemIndex:number)=>{
                              if (item["id"]=="F" && covType!==CovenantTypeList[1])
                                return null;
                              else if (item["type"]=="select")
                                return <span key={index+"_"+itemIndex} className="mr-3">
                                  <SelectField index={index} id={item["id"]} name={item["name"]} 
                                    required={item["required"]?true:false} options={item["options"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                                    prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                                    setFileType={setFileType} setCovType={setCovType} sectionType={props.type}
                                  />
                                </span>
                              else if (item["type"]=="date")
                                return <span key={index+"_"+itemIndex} className="mr-3">
                                  <DateField index={index} id={item["id"]} name={item["name"]} 
                                    required={item["required"]?true:false} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                                    prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                                  />
                                </span>
                              else
                                return <span key={index+"_"+itemIndex} className="mr-3">
                                  <TextField index={index} id={item["id"]} name={item["name"]} type={item["type"]} 
                                    required={item["required"]?true:false} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                                    prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                                  />
                                </span>  
                            })}
                          </div>
                        </div>
                      )
                    }
                  })}
                  {errorMessage}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card className="mt-5" style={{borderWidth:"0px", borderColor:"white"}}>
              <CardContent className="border-0">
                <FileField key={100} index={100} fileType={fileType} fileList={fileList} fileSetter={setFileList} validateRequiredFields={validateRequiredFields} formSubmit={props.fileSubmit} edit={props.edit} prefillValues={prefillValues} docId={docId} deleteFile={props.deleteFile} receivedFilesFromServer={recievedFilesFromServer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <br/>
        <br/>
        <AlertDialogFooter className="bottom-0 h-12">
          <AlertDialogCancel className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</AlertDialogCancel>
          <button className={SubmitButtonStyling} onClick={()=>{currentTab=="details"?submitDetails():submitFile()}}>{currentTab=="details"?"Next":"Save"}</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>  
  )
};

function FileField (props:{index:number, fileType:number, fileList:any, fileSetter:Function, validateRequiredFields:Function, formSubmit:Function, prefillValues:any, edit?:boolean, docId:string, deleteFile:Function, receivedFilesFromServer:boolean }) {
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone({multiple:false, useFsAccessApi:false});


  useEffect(()=>{
    console.log("fileList",props.fileList);
  },[props.fileList]);
  
  const [error, setError] = useState(<></>);
  
  useEffect(()=>{
    updateFilelist();
  },[acceptedFiles]);

  const updateFilelist = (deleteFile?:boolean) => {
    console.log("updating");
    if (deleteFile){
      props.fileSetter([]);
      return;
    }
    
    props.fileSetter((curr:any)=>{
      const arr = [];
      if (acceptedFiles && acceptedFiles.length>0){
        for (let i=0; i<acceptedFiles.length; i++)
          arr.push(acceptedFiles[i]);
        setError(<></>);
        return arr;
      }
      return curr;
    });
  }

  const obliterateFile = async () => {
    if (!props.receivedFilesFromServer){
      console.log("pre",acceptedFiles);
      acceptedFiles.pop();
      console.log("post",acceptedFiles);
      updateFilelist(true);
    }
    else{
      console.log(props.fileList)
      const res = await props.deleteFile(props.docId,props.fileList[0].filename);
      if (res==200)
        updateFilelist(true);
      else
        setError(<p className="text-yellow-700">Something went wrong. Try again later.</p>)
    }
    /* const res = await props.deleteFile(props.docId,fileName);
    if (res==200){
      toast({
        title: "Success!",
        description: <p className="text-black">Your document has been successfully deleted</p>,
        className:"bg-white",
        color:"text-green-500"
      })
      getUploadedFiles();
    }
    else
      setError(<p className="text-yellow-700">Something went wrong. Try again later.</p>);
    */  
  }

  return (
    <div>
      <div style={{backgroundColor:"rgba(80, 65, 188, 0.06)"}} {...getRootProps({className: 'hover:cursor-default h-[82px] border-2 border-blue-700	 border-dashed rounded-xl dropzone'})}>
        <input {...getInputProps()} multiple={false} />
        <div className="my-2 text-center">
          <span className="inline-block align-middle text-custom-1"><Upload/></span>
          <p className="text-custom-1">Choose File to {props.fileList && props.fileList.length!=0?"Replace":"Upload"}</p>
        </div>
      </div>
      <br/>
      <div className="flex flex-row">
        <p className="flex-auto font-light text-sm flex-auto">Supported Formats:{FileTypeList.map(ft=>" "+ft).toString()}</p>
        {/* {props.edit?<button className="text-custom-1" onClick={()=>getUploadedFiles()}>Get Uploaded Files</button>:<></>} */}
      </div>
      <br/>
      {error}
      <br/>
      <div>
        {props.fileList.map((item:any,index:number)=>{
          return (
            <div key={index} className="border p-3 flex flex-row">
              <div key={index} className="flex-auto">
                <p>{item.originalname?item.originalname:item.name}</p>
              </div>
              <button type="button" onClick={()=>obliterateFile()}><Close/></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
    
export default FormDialogDocuments;
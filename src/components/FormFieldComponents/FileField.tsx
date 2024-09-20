import { useContext, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MasterValuesContext } from "@/Contexts";
import { FieldValues } from "@/types/DataTypes";

import FileViewer from "../BasicComponents/FileViewer";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Close from "@mui/icons-material/Close";

function FileField (props:{index:number, fileList:FieldValues[], fileSetter:Function, prefillValues:any, edit?:boolean, docId:string, deleteFile:Function, receivedFilesFromServer:boolean, setReceivedFilesFromServer:Function }) {
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone({multiple:false, useFsAccessApi:false});

  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { FileTypeList } = masters;

  const [error, setError] = useState(<></>);
  const [redirect, setRedirect] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileDetails, setFileDetails] = useState<FieldValues>();

  const fileRef = useRef<any>();
  
  useEffect(()=>{
    updateFilelist();
  },[acceptedFiles]);

  const updateFilelist = (deleteFile?:boolean) => {
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
    if (acceptedFiles.length>0){
      acceptedFiles.pop();
      updateFilelist(true);
    }
    
    if (props.receivedFilesFromServer && props.fileList && props.fileList.length>0){
      const filename = props.fileList[0].filename;
      const res = await props.deleteFile(props.docId,filename);
      if (res==200){
        updateFilelist(true);
        props.setReceivedFilesFromServer(false);
      }
      else
        setError(<p className="text-yellow-700">Something went wrong. Try again later.</p>)
    }  
  }

  const openFile = () => {
    if (props.receivedFilesFromServer){
      const fileDetails = props.fileList[0].path.split("\\");
      const obj:FieldValues={};
      obj["AID"] = fileDetails[3];
      obj["sectionKeyName"] = fileDetails[4];
      obj["filename"] = fileDetails[5];
      obj["actualName"] = props.fileList[0].originalname;
      setFileDetails(obj);
      setOpenDialog(true);
    }
    else {
      const src =  URL.createObjectURL(acceptedFiles[0]);
      setFileDetails({src});
      setRedirect(true);
    }
  }

  useEffect(()=>{
    if (redirect && fileRef && fileRef.current && !props.receivedFilesFromServer){
      fileRef.current.click();
      setRedirect(false);
    }
  },[redirect])

  return (
    <div>
      {/* {props.fileList && props.fileList.length!=0
        ?<p className="text-orange-500 my-2 text-center">Note: If you upload a file now, you will have to first delete the existing file</p>
        : */}<div>
          <div style={{backgroundColor:"rgba(80, 65, 188, 0.06)"}} {...getRootProps({className: 'hover:cursor-default h-[82px] border-2 border-blue-700	 border-dashed rounded-xl dropzone'})}>
            <input {...getInputProps()} multiple={false} id={props.index.toString()} />
            <div className="my-2 text-center">
              <span className="inline-block align-middle text-custom-1"><FileUploadIcon/></span>
              <p className="text-custom-1">Choose File to {props.fileList && props.fileList.length!=0?"Replace":"Upload"}</p>
            </div>
          </div>
          <br/>
          <div className="flex flex-row">
            <p className="flex-auto font-light text-sm flex-auto">Supported Formats:{FileTypeList.slice(1).map(ft=>" "+ft).toString()}</p>
          </div>
        </div>
      {/* } */}
    
      <br/>
      {error}
      <br/>
      <div>
        {props.fileList.map((item:any,index:number)=>{
          const fileName = item.originalname?item.originalname:item.name;
          const size = item.size;
          let fileSize ="";
          if (size<1000)
            fileSize= size+" bytes";
          else if (size<1_000_000)
            fileSize = (size/1000).toFixed(2)+" KB";
          else if (size<1_000_000_000)
            fileSize = (size/1_000_000).toFixed(2)+ " MB";
          else
            fileSize = (size/1_000_000_000).toFixed(2)+ " GB";
          return (
            <div key={index}>
              <div className="border p-3 flex flex-row">
                <div className="flex-auto">
                  <button className="text-blue-600 hover:underline" onClick={openFile}>
                    <p className="text-lg">{fileName}</p>
                  </button>
                <div>
                  <p className="text-sm float-left">File Size: <span className="">{fileSize}</span></p>
                </div>
                </div>
                <button type="button" onClick={()=>obliterateFile()}><Close/></button>
              </div>
              {fileDetails
                ?props.receivedFilesFromServer
                  ?<FileViewer 
                    AID={fileDetails["AID"]} loanId={props.prefillValues["_id"]}  
                    fileName={fileDetails["filename"]} actualName={fileDetails["actualName"]} 
                    type="doc" 
                    docId={props.docId} 
                    status={props.prefillValues["S"]} rejectionReason={props.prefillValues["R"]}
                    sectionKeyName={fileDetails["sectionKeyName"]} 
                    openDialog={openDialog} setOpenDialog={setOpenDialog} 
                    setAdded={()=>{}} 
                    setIsDeleted={()=>{}} 
                  />
                  :<a 
                    href={fileDetails["src"]} 
                    onLoad={()=>URL.revokeObjectURL(fileDetails["src"])} 
                    target="_blank" 
                    ref={fileRef}>
                  </a>
                :<></>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FileField;
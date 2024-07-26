import { useEffect, useState } from "react";
import { FileTypeList } from "../../../Constants";
import { useDropzone } from "react-dropzone";

import { Upload } from "lucide-react";
import Close from "@mui/icons-material/Close";
function FileField (props:{index:number, fileList:any, fileSetter:Function, validateRequiredFields:Function, formSubmit:Function, prefillValues:any, edit?:boolean, docId:string, deleteFile:Function, receivedFilesFromServer:boolean, setReceivedFilesFromServer:Function }) {
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone({multiple:false, useFsAccessApi:false});
  
  const [error, setError] = useState(<></>);

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

  return (
    <div>
      {props.fileList && props.fileList.length!=0?
        <p className="text-orange-500 my-2 text-center">Note: If you upload a file now, you will have to first delete the existing file</p>
        :<div>
          <div style={{backgroundColor:"rgba(80, 65, 188, 0.06)"}} {...getRootProps({className: 'hover:cursor-default h-[82px] border-2 border-blue-700	 border-dashed rounded-xl dropzone'})}>
            <input {...getInputProps()} multiple={false} />
            <div className="my-2 text-center">
              <span className="inline-block align-middle text-custom-1"><Upload/></span>
              <p className="text-custom-1">Choose File to {props.fileList && props.fileList.length!=0?"Replace":"Upload"}</p>
            </div>
          </div>
          <br/>
          <div className="flex flex-row">
            <p className="flex-auto font-light text-sm flex-auto">Supported Formats:{FileTypeList.slice(1).map(ft=>" "+ft).toString()}</p>
          </div>
        </div>
      }
      
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
            <div key={index} className="border p-3 flex flex-row">
              <div key={index} className="flex-auto">
                <p>{fileName}</p>
                <p className="text-sm">File Size: <span className="">{fileSize}</span></p>
              </div>
              <button type="button" onClick={()=>obliterateFile()}><Close/></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FileField;
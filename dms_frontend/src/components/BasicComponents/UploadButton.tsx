import upload_icon from "./../static/upload_icon.svg";
import view_icon from "./../static/view_files_icon.svg";
import { useEffect, useState } from "react";
import FormDialogFiles from "../FormComponents/FormDialogFiles";

function UploadButton(){
  const [files, setFiles] = useState<any>([]);

  useEffect(()=>{
    console.log("file list", files);
    //send file
  },[files]);

  return(
    <div>
      <label className="flex flex-row border-2 border-dashed rounded-xl m-auto py-2 w-28 inline-block align-middle" style={{backgroundColor: "rgba(225, 237, 255, 1)", borderColor: "rgba(148, 192, 255, 1)"}} htmlFor="file">
        <div className="m-auto"><img src={upload_icon}/></div>
        <div className="m-auto"><span style={{color: "rgba(71, 145, 249, 1)"}}>Upload</span></div>
      </label>
      <input id="file" type="file" style={{width:"0.1px", opacity:"0"}} 
        multiple
        onChange={
          (e)=>setFiles((curr:any)=>{
            const arr  = [...curr];
            if (e.target.files && e.target.files.length>0)
              for (let i=0; i<e.target.files.length; i++){
                arr.push(e.target.files[i]);
              }
              console.log("new curr", arr);
            return arr;
          })
        }
      />
    </div>
  )
};

function ViewFilesButton(){
  return(
    <div>
      <FormDialogFiles
        triggerText={
          <div className="flex flex-row rounded-xl py-3 px-3 w-28 m-auto ml-7 inline-block align-middle" style={{backgroundColor:"rgba(255, 245, 204, 1)"}}>
            <img className="m-auto" src={view_icon} />
            <span className="m-auto" style={{color:"rgba(255, 178, 0, 1)"}}>View</span>
          </div>
        }
      />
    </div>
  )
};

export {UploadButton, ViewFilesButton};
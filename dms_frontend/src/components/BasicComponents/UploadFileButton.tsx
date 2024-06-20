import upload_icon from "./../static/upload_icon.svg";
import { useEffect, useState } from "react";

function UploadFileButton(){
  const [files, setFiles] = useState<any>([]);

  useEffect(()=>{
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
              for (let i=0; i<e.target.files.length; i++)
                arr.push(e.target.files[i]);
            return arr;
          })
        }
      />
    </div>
  )
};

export default UploadFileButton;
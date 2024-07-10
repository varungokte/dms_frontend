import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";

import { toast } from "../ui/use-toast";
import upload_icon from "./../static/upload_icon.svg";

function UploadFileButton(props:{index:number, AID:string, sectionName:string, docId:number|string, setAdded:Function, _id?:string, isPayment?:boolean}){
  const [files, setFiles] = useState<any>([]);

  const uploadFile = async (userFiles:any) => {
    const { uploadFile } = useGlobalContext();
  
    const formData = new FormData();
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i]);

    console.log("submitting file","AID",props.AID,"index",props.docId,)
    const res = await uploadFile(formData, `${props.AID}/${props.sectionName}`,props.docId, props._id, props.isPayment);
    return res;
  }

  useEffect(()=>{
    if (files && files.length>0)
      uploadFile(files).then(res=>{
        console.log("FILE UPLOADED",res);
        if (res==200)
          props.setAdded(true);
        else
          toast({
            description:"An error has occured",
            className:"bg-white"
          })
      });
  },[files]);

  return(
    <div key={props.index}>
      <label className="flex flex-row border-2 border-dashed rounded-xl p-3 w-28 " 
        style={{backgroundColor: "rgba(225, 237, 255, 1)", borderColor: "rgba(148, 192, 255, 1)"}} 
        htmlFor={props.index+"upload"}
      >
        <div className="m-auto"><img src={upload_icon}/></div>
        <div className="m-auto"><span style={{color: "rgba(71, 145, 249, 1)"}}>Upload</span></div>
      </label>
      <input id={props.index+"upload"} type="file" style={{width:"0.1px", opacity:"0"}} 
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

//inline-block align-middle m-auto

export default UploadFileButton;
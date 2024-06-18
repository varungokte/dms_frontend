import { ReactElement, useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { Dialog,DialogContent,DialogTitle } from "@mui/material";
import view_icon from "./../static/view_files_icon.svg";
import LoadingMessage from "./LoadingMessage";
import { DocumentRejectionReasonList, DocumentStatusList } from "./../../../Constants";
import { FieldValues } from "./../../../DataTypes";

function ViewFileButton(props:{AID:string, loanId:string, docId:string, sectionName:string, fileName:string}){
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <button  onClick={()=>setOpenDialog(true)} className="flex flex-row rounded-xl py-3 px-3 w-28 m-auto ml-7 inline-block align-middle" style={{backgroundColor:"rgba(255, 245, 204, 1)"}}>
        <img className="m-auto" src={view_icon} />
        <span className="m-auto" style={{color:"rgba(255, 178, 0, 1)"}}>View</span>
      </button>
      {openDialog
        ?<Dialog onClose={()=>setOpenDialog(false)} fullScreen open={openDialog}>
          <FileViewer {...props} setOpenDialog={setOpenDialog}/>
        </Dialog>
        :<></>
      }
    </div>
  )
};

function FileViewer(props:{AID:string, loanId:string, docId:string, sectionName:string, fileName:string, setOpenDialog:Function}){      
  const [showDoc, setShowDoc] = useState<ReactElement>(<LoadingMessage sectionName="file"/>);
  const {fetchDocument,editDocument}=useGlobalContext();
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, /* setRejectionReason */] = useState("");

  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  
  useEffect(()=>{
    fetchDocument(props.AID, props.sectionName,props.fileName).then(res=>{
      if (res.status==200)
        setShowDoc(<iframe src={res.url} width="97%" height="95%" title="Document Viewer"></iframe>)
      else
        setShowDoc(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>)
    }).catch(err=>{
      console.log("an error", err)
    })
  },[]);
  
  const changeStatus = async (status:string, remark?:string) => {
    const data:FieldValues= {};
    data["_loanId"]=props.loanId;
    data["_id"]=props.docId;
    data["SN"]=props.sectionName;
    data["S"]=status;
    if (status==DocumentStatusList[4] && remark)
      data["R"]=remark;
    console.log("SUBMITTING DATA",data);
    const res = await editDocument(data);
    //console.log("RESPONSE",res)
    if (res.status==200){
      if (status==DocumentStatusList[3])
        setVerified(true);
      else
        setRejected(true);
    }
    else
      console.log("ERROR")
  }


  return (<>
    <DialogTitle>
      <div className="flex flex-row bg-black">
        <p className="flex-auto text-white">{props.fileName}</p>
        <button className="border-2 mx-5 p-2 rounded-if border-white text-white">Replace</button>
        <button className="border-2 mx-5 p-2 rounded-if border-red-600 text-red-600">Delete</button>
        <button 
          className={`border-2 mx-5 p-2 rounded-if ${rejected?"text-gray-800":"text-white"}`}
          onClick={()=>setOpenRejectionDialog(true)}
          disabled={rejected}
          >
            Reject
          </button>

          <Dialog onClose={()=>setOpenRejectionDialog(false)} open={openRejectionDialog} maxWidth="sm">
            <DialogTitle><div>Reject Document</div></DialogTitle>
            <DialogContent>
              <b className="text-lg">Reason</b>
              {DocumentRejectionReasonList.map((reason,index)=>{
                if (index!=0)
                return (
                  <div className="my-2">
                    <input id={index+""} type="checkbox" className="mx-5"/>
                    <label id={index+"label"} htmlFor={index+""}>{reason}</label>
                  </div>
                )
              })}
              <b className="text-lg">Comments</b><br/>
              <input type="textarea" className="border rounded-if w-full h-full p-4 my-1 "/>
              <button onClick={()=>changeStatus(DocumentStatusList[4],rejectionReason)}>Submit</button>
            </DialogContent>
          </Dialog>


        <button 
          className={`border-2 mx-5 py-2 px-5 rounded-if ${verified?"border-lime-700":"border-lime-500"} ${verified?"bg-lime-700":"bg-lime-500"} text-white`}
          onClick={()=>changeStatus(DocumentStatusList[3])}
          disabled={verified}
        >
          {verified?"Verified":"Verify"}
        </button>
        <button className="mx-5 p-2 text-white" onClick={()=>props.setOpenDialog(false)}>X</button>
      </div>
    </DialogTitle>
    <DialogContent>
      {showDoc}
    </DialogContent>
  </>)
}

export default ViewFileButton;
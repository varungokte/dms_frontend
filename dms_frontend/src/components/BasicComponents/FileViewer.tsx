import { ReactElement, useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { DocumentRejectionReasonList } from "./../../../Constants";
import { CommonFileViewerProps, DocumentFileViewerProps, DocumentStatus, FieldValues, PaymentFileViewerProps } from "./../../../DataTypes";

import { Dialog,DialogContent,DialogTitle } from "@mui/material";
import LoadingMessage from "./LoadingMessage";

import { SubmitButtonStyling } from "./PurpleButtonStyling";
import CloseIcon from '@mui/icons-material/Close';
 
//IMPORTANT
//docId is only present when !isPayment

function FileViewer(props:CommonFileViewerProps & (DocumentFileViewerProps|PaymentFileViewerProps) & {setOpenDialog:Function}){
  const [showDoc, setShowDoc] = useState<ReactElement>(<LoadingMessage sectionName="file"/>);
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [errorMessage, setErrorMessage] = useState(<></>);

  const {fetchDocument,editDocument, addPaymentSchedule}=useGlobalContext();

  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  
  useEffect(()=>{
    fetchDocument(props.AID, props.sectionName,props.fileName).then(res=>{
      if (res.status==200)
      setShowDoc(<iframe src={res.url+"#toolbar=0"} width="97%" height="95%" title="Document Viewer"></iframe>)
      else
        setShowDoc(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>)
    }).catch(()=>{
      setShowDoc(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>)
    })
  },[]);

  useEffect(()=>{
    if (props.status=="Rejected")
      setRejected(true);
    if (props.status=="Verified")
      setVerified(true);
  },[props.status]);
  
  const changeStatus = async (status:DocumentStatus) => {
    const data:FieldValues= {};
    let res;

    if (props.type=="pay"){
      data["_id"]=props._id;
      data["POS"]=props.index;

      props.schedule[props.index]["S"]=status;
      if (status=="Rejected")
        props.schedule[props.index]["R"]=rejectionReason=="Other"?rejectionText:rejectionReason;
      else if (props.schedule[props.index]["R"])
        delete props.schedule[props.index]["R"];
      data["GS"] = props.schedule;
      
      res = await addPaymentSchedule(data);
    }
    else{
      data["_loanId"]=props.loanId;
      data["_id"]=props.docId;
      data["SN"]=props.sectionName;
      data["S"]=status;
      
      if (status=="Rejected")
        data["R"]=rejectionReason=="Other"?rejectionText:rejectionReason;
      else if (status=="Verified" && data["R"])
        delete data["R"];
     
      res = (await editDocument(data)).status;
    }
    if (res==200){
      if (status=="Verified")
        setVerified(true);
      else
        setRejected(true);
      setOpenRejectionDialog(false);
      props.setAdded(true);
    }
    else
      setErrorMessage(<p className="text-yellow-700">Something went wrong</p>)
  }

  return (<>
    <div className="flex flex-row p-2 bg-black">
      <p className="flex-auto text-white m-auto mx-2 ">{props.actualName}</p>
      
      {/* <button className="border-2 m-auto mx-5 p-2 rounded-if border-white text-white">Replace</button>
      <button className="border-2 m-auto mx-5 p-2 rounded-if border-red-600 text-red-600">Delete</button> */}
      
      {rejected
        ?<span className="text-red-500 flex-auto my-auto">Document Rejected: {props.rejectionReason}</span>
        :<div>
          <button 
          className={`border-2 mx-5 w-28 p-2 m-auto rounded-if text-white hover:bg-gray-800 click:bg-gray-800`} 
          onClick={()=>setOpenRejectionDialog(true)}
          >
            Reject
          </button>
          <button 
            className={`border-2 mx-5 py-2 px-5  m-auto rounded-if ${verified?"border-lime-700":"border-lime-500"} ${verified?"bg-lime-700":"bg-lime-500"} text-white`}
            onClick={()=>changeStatus("Verified")}
            disabled={verified}
          >
            {verified?"Verified":"Verify"}
          </button>
        </div>
      }

      <RejectionDialog openDialog={openRejectionDialog} setOpenDialog={setOpenRejectionDialog} 
        rejectionReason={rejectionReason} setRejectionReason={setRejectionReason}
        rejectionText={rejectionText} setRejectionText={setRejectionText}
        changeStatus={changeStatus}
      />

      <button className="mx-5 p-2 text-white m-auto mx-2" onClick={()=>props.setOpenDialog(false)}>{<CloseIcon/>}</button>
    </div>
    
    <DialogContent>
      {errorMessage}
      {showDoc}
    </DialogContent>
  </>
  )
}

function RejectionDialog(props: {openDialog:boolean, setOpenDialog:Function, rejectionReason:string, setRejectionReason:Function, rejectionText:string, setRejectionText:Function, changeStatus:Function }){
  const otherReasons = "Other";
  const [rejectionError, setRejectionError] = useState(<></>);
  
  return (
    <Dialog onClose={()=>props.setOpenDialog(false)} open={props.openDialog} maxWidth="sm" fullWidth>
    <DialogTitle><div>Reject Document</div></DialogTitle>
    <DialogContent>
      <b className="text-lg">Reason</b>
      {DocumentRejectionReasonList.map((reason,index)=>{
        if (index!=0)
          return (
            <div key={index} className="my-2">
              <input id={index+""} type="checkbox" className="mx-5" 
                checked={props.rejectionReason==reason}
                onChange={(e)=>{
                  if (e.target.checked)
                    props.setRejectionReason(reason);
                  else if (props.rejectionReason==reason)
                  props.setRejectionReason("");
                  }}
                />
              <label id={index+"label"} htmlFor={index+""}>{reason}</label>
            </div>
          )
      })}
      <div key={-10} className="my-2">
        <input id={-10+""} type="checkbox" className="mx-5" 
          checked={props.rejectionReason==otherReasons}
          onChange={(e)=>{
            if (e.target.checked)
              props.setRejectionReason(otherReasons);
            else if (props.rejectionReason==otherReasons)
            props.setRejectionReason("");
            }}
          />
        <label id={-10+"label"} htmlFor={-10+""}>{otherReasons}</label>
      </div>

      {props.rejectionReason==otherReasons?<textarea className="border rounded-if w-full h-full p-4 mx-3  my-1" value={props.rejectionText} onChange={(e)=>props.setRejectionText(e.target.value)}/>:<></>}
      <button 
        className={`float-right ${SubmitButtonStyling} mt-5 h-[40px]`}
        onClick={()=>{
          if (props.rejectionReason)
            props.changeStatus("Rejected"); 
          else 
            setRejectionError(<p className="text-red-500 mx-2">A reason or comment must be provided.</p>)
        }} 
      >
        Submit
      </button>
      {rejectionError}
    </DialogContent>
  </Dialog>
  )
}

export default FileViewer;
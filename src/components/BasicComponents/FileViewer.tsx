import { useContext, useEffect, useMemo, useState } from "react";
import { MasterValuesContext } from "@/Contexts";
import { DocumentStatus, FieldValues } from "@/types/DataTypes";
import { CommonFileViewerProps, DocumentFileViewerProps, PaymentFileViewerProps } from "@/types/ComponentProps";
import { editDocument } from "@/apiFunctions/documentAPIs";
import { addPaymentSchedule } from "@/apiFunctions/paymentAPIs";
import { deleteFile, getSingleFile } from "@/apiFunctions/fileAPIs";

import { Button, Dialog,DialogContent,DialogTitle, Typography } from "@mui/material";
import { pdfjs,Document,Page } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmation from "@/components/BasicComponents/DeleteConfirmation";
 
//IMPORTANT
//docId is only present when !isPayment

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function FileViewer(props:CommonFileViewerProps & (DocumentFileViewerProps|PaymentFileViewerProps) & {openDialog:boolean, setOpenDialog:Function, setIsDeleted:Function}){  
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [zoom, setZoom] = useState(1);

  const [pdfPageCount, setPdfPageCount] = useState(1);

  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState([false]);

  const [file, setFile] = useState<Blob>();
  const [fileType, setFileType] = useState<"pdf"|"image"|"other"|"error">();

  //useEffect(()=>console.log("file viewer props",props),[props])

  const getData = async ()=> {
    const res = await getSingleFile(props.AID,props.sectionKeyName,props.fileName)
    //console.log("type",res.type,"split",res.type.split("/"));
    if (res.status==200){
      setFile(res.file);
      if (res.type=="application/pdf")
        setFileType("pdf");
      else if (res.type.split("/")[0]=="image")
        setFileType("image");
      else
        setFileType("other");
    }
    else
      setFileType("error");
  }
  
  const fileData = useMemo(getData,[]);

  useEffect(()=>{
    if (props.status=="Rejected")
      setRejected(true);
    if (props.status=="Verified")
      setVerified(true);
  },[props.status]);

  const changeStatus = async (status:DocumentStatus) => {
    const data:FieldValues = {};
    let res;

    if (props.type=="pay"){
      data["_id"]=props.scheduleId;
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
      data["SN"]=props.sectionKeyName;
      data["S"]=status;
      
      if (status=="Rejected")
        data["R"]=rejectionReason=="Other"?rejectionText:rejectionReason;
      else if (status=="Verified" && data["R"])
        delete data["R"];
      console.log("DATA",data);
      res = (await editDocument(data)).status;
    }
    console.log("edit response",res);
    
    if (res==200){
      if (status=="Verified")
        setVerified(true);
      else if (status=="Rejected")
        setRejected(true);
      else
        setVerified(false);
      setOpenRejectionDialog(false);
      props.setAdded(true);
    }
    else
      setErrorMessage(<p className="text-yellow-700">Something went wrong</p>);
  }

  const deleteDoc = async (currIndex:number) => {
    //console.log("deleting",props.AID,props.docId,props.sectionKeyName,props.fileName)
    const args:FieldValues = {AID:props.AID,sectionKeyName:props.sectionKeyName,fileName:props.fileName};
    if (props.type=="doc")
      args["docId"] = props.docId;
    else{
      args["docId"] = props.scheduleId;
      args["index"] = currIndex;
    }

    const res = await deleteFile(args as any);
    if (res==200){
      props.setIsDeleted(res);
      props.setAdded(true);
    }
  }

  return (
    <Dialog open={props.openDialog} onClose={()=>props.setOpenDialog(false)} fullScreen>
      <div className="flex flex-row p-2 bg-black">
        <p className="flex-auto text-white m-auto mx-2 ">{props.actualName}</p>
        
        {rejected
          ?<span className="text-red-500 flex-auto my-auto">Document Rejected: {props.rejectionReason}</span>
          :<div>
            <button 
              className={`border-2 mx-5 py-2 px-5  m-auto rounded-if ${verified?"border-red-700":"border-lime-600"} ${verified?"bg-red-700":"bg-lime-600"} text-white`}
              onClick={()=>changeStatus(verified?"In progress":"Verified")}
            >
              {verified?"Un-Verify":"Verify"}
            </button>
            <button 
              className={`border-2 mx-5 w-28 p-2 m-auto rounded-if text-white hover:bg-gray-800 click:bg-gray-800`} 
              onClick={()=>setOpenRejectionDialog(true)}
            >
              Reject File
            </button>
          </div>
        }
        <button onClick={()=>setOpenDeleteDialog([true])} className="border-2 m-auto mx-5 p-2 rounded-if border-red-600 text-red-600 hover:bg-gray-800 click:bg-gray-800">Delete File</button>
        {openDeleteDialog[0]?<DeleteConfirmation thing="file" deleteFunction={deleteDoc} currIndex={props.type=="pay"?props.index:-1} open={openDeleteDialog[0]} setOpen={setOpenDeleteDialog} />:<></>}

        <RejectionDialog openDialog={openRejectionDialog} setOpenDialog={setOpenRejectionDialog} 
          rejectionReason={rejectionReason} setRejectionReason={setRejectionReason}
          rejectionText={rejectionText} setRejectionText={setRejectionText}
          changeStatus={changeStatus}
        />

        <button className="mx-5 p-2 text-white m-auto mx-2" onClick={()=>props.setOpenDialog(false)}>{<CloseIcon/>}</button>
      </div>
      <DialogContent className={`${fileType=="pdf"?"m-auto bg-slate-200":""}`} >
        {fileType=="pdf"
          ?<div>
            <button onClick={()=>setZoom(curr=>curr-0.25)}><ZoomOutIcon/></button>
            <button onClick={()=>setZoom(curr=>curr+0.25)}><ZoomInIcon/></button>
          </div>
          :<></>
        }
      
        {errorMessage}
        <div className="">
          {(()=>{
            if (!fileType)
              return;
            if (fileType=="error")
              return(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>);
            if (!file || !fileData)
              return;
            
            if (fileType=="pdf"){
              return (
                <Document file={file} onLoadSuccess={(doc)=>setPdfPageCount(doc.numPages)} className="border border-black" onContextMenu={(e)=>e.preventDefault()}>
                  {(new Array(pdfPageCount||1).fill(1)).map((_,index)=>{
                    return(
                      <div key={index+1}>
                        <Page pageNumber={index+1} scale={zoom} />
                        <p className="mx-2 ">Page {index+1}</p>
                        <hr style={{border:"solid", color:"gray"}}/>
                      </div>
                    )
                  })}
                </Document>
              )
            }
            else if (fileType=="image"){
              const src = URL.createObjectURL(file);
              return (
                <div onContextMenu={(e)=>e.preventDefault()}>
                  <img className="m-auto" width="50%" src={src} onLoad={()=>URL.revokeObjectURL(src)}/>
                </div>
              )
            }
            else
              return <iframe src={URL.createObjectURL(file)+"#toolbar=0"} width="97%" height="95%" title="Document Viewer"></iframe>
          })()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RejectionDialog(props: {openDialog:boolean, setOpenDialog:Function, rejectionReason:string, setRejectionReason:Function, rejectionText:string, setRejectionText:Function, changeStatus:Function }){
  const otherReasons = "Other";
  const [rejectionError, setRejectionError] = useState(<></>);
  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { DocumentRejectionReasonList } = masters;
  
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
      <Button color="secondary" variant="contained" size="large" sx={{borderRadius:"10px"}}
        className={`float-right mt-5 h-[40px]`}
        onClick={()=>{
          if (props.rejectionReason)
            props.changeStatus("Rejected"); 
          else 
            setRejectionError(<p className="text-red-500 mx-2">A reason or comment must be provided.</p>)
        }} 
      >
        <Typography textTransform="capitalize">Submit</Typography>
      </Button>
      {rejectionError}
    </DialogContent>
  </Dialog>
  )
}

export default FileViewer;
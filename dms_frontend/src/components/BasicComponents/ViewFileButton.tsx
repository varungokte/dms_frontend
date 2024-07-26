import { useState } from "react";
import { CommonFileViewerProps, DocumentFileViewerProps, PaymentFileViewerProps } from "./../../../DataTypes";

import { Dialog } from "@mui/material";
import FileViewer from "./FileViewer";
import view_icon from "./../static/view_files_icon.svg";

function ViewFileButton(props:CommonFileViewerProps & (DocumentFileViewerProps|PaymentFileViewerProps)){
  const [openDialog, setOpenDialog] = useState(false);
  const disabledOpacity="opacity-70";
  return (
    <div>
      <button
        disabled={props.disabled}
        className={`flex flex-row rounded-xl p-3 w-28 ${props.disabled?"hover:cursor-not-allowed":"hover:cursor-pointer"} ${props.disabled?disabledOpacity:""} `}
        style={{backgroundColor:"rgba(255, 245, 204, 1)"}}
        onClick={()=>setOpenDialog(true)}
      >
        <img className={`m-auto  ${props.disabled?disabledOpacity:""}`} src={view_icon} />
        <span className={`m-auto  ${props.disabled?disabledOpacity:""}`} style={{color:"rgba(255, 178, 0, 1)"}}>View</span>
      </button>
      {openDialog
        ?<Dialog open={openDialog} onClose={()=>setOpenDialog(false)} fullScreen>
          <FileViewer {...props} setOpenDialog={setOpenDialog} status={props.status} setAdded={props.setAdded} rejectionReason={props.rejectionReason} />
        </Dialog>
        :<></>
      }
    </div>
  )
};

export default ViewFileButton;
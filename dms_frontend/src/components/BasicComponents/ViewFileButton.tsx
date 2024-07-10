import { useState } from "react";
import { CommonFileViewerProps, DocumentFileViewerProps, PaymentFileViewerProps } from "./../../../DataTypes";

import { Dialog } from "@mui/material";
import FileViewer from "./FileViewer";
import view_icon from "./../static/view_files_icon.svg";

function ViewFileButton(props:CommonFileViewerProps & (DocumentFileViewerProps|PaymentFileViewerProps)){
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <button onClick={()=>setOpenDialog(true)}
       className="flex flex-row rounded-xl p-3 w-28" 
       style={{backgroundColor:"rgba(255, 245, 204, 1)"}}
      >
        <img className="m-auto" src={view_icon} />
        <span className="m-auto" style={{color:"rgba(255, 178, 0, 1)"}}>View</span>
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
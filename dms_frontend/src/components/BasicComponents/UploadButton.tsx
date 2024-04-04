import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import upload_icon from "./../static/upload_icon.svg";
import info_icon from "./../static/info_icon.svg";

function UploadButton(props:any) {
  return(
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row border-2 border-dashed rounded-xl py-2 w-28" style={{backgroundColor: "rgba(225, 237, 255, 1)", borderColor: "rgba(148, 192, 255, 1)"}}>
              <img className="m-auto" src={upload_icon}/>
              <span className="m-auto" style={{color: "rgba(71, 145, 249, 1)"}}>Upload</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white">
          <div className="flex flex-row"><img src={info_icon} className="mr-2"/><p>Upload Document as {props.fileType}</p></div>  
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
};

export default UploadButton;
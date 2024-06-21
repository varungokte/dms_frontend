/* import { Dialog, DialogContent, DialogTrigger, } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import pdf_icon from "./../static/pdf_icon.svg";
import xlsx_icon from "./../static/xlsx_icon.svg";
import { Plus } from "lucide-react";
import DeleteConfirmation from "../BasicComponents/DeleteConfirmation";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FileStatusList } from "../../../Constants";

function FormDialogFiles(props:{triggerText:any}){
  const [files,setFiles] = useState<any>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  useEffect(()=>{
    const incoming = [
      {name:"testsomedata.pdf", size:25, status:2 },
      {name:"moredata.xlsx", size:122, status:1 },
      {name:"evenmoredata.pdf", size:23.125, status:1 },
    ]; 
    setFiles(incoming);
    setSelectedFiles([false,false,false]);
  },[]);

  useEffect(()=>{
    console.log(files);
  },[files]);

  useEffect(()=>{
    setShowDeleteAll(areMultipleSelected());
  },[selectedFiles]);

  const areMultipleSelected = () => {
    let selected=0; 
    selectedFiles.map((val:any)=>{
      if (val==true)
        selected++;
    });
    return selected>1;
  }

  const areAllSelected = () =>{
    let selected=true; 
    selectedFiles.map((val:any)=>{
      if (val==false)
        selected=false
    }); 
    return selected;
  };

  const selectAll = () => {
    let newVal;
    if (!areAllSelected())
      newVal = selectedFiles.map(()=>{
        return true;
      });
    else
      newVal = selectedFiles.map(()=>{
        return false;
      });

    setSelectedFiles(newVal);
  };

  const deleteFile = (index:number) => {
    console.log("deleting ",files[index]["name"]);
  }

  return (
    <Dialog>
      <DialogTrigger>{props.triggerText}</DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle>
          <br/>
          <div className="flex flex-row">
            <span className="">
              <input type="checkbox" 
                checked={areAllSelected()}
                onChange={()=>selectAll()} 
                className="inline-block align-middle"
                style={{width:"20px", height:"20px", marginTop:"2px"}} 
              />
            </span>
            <span className="flex-auto"><p className="mt-1 inline-block align-middle mx-2 text-base hover:cursor-default" onClick={()=>selectAll()}>Select all documents</p></span>
            <div>
              {showDeleteAll
                ?<DeleteConfirmation thing="file" deleteFunction={deleteFile} currIndex={0} />
                :<></>
              }
            </div>
            <label className="bg-custom-1 text-white w-[100px] rounded-[8px] pl-5" htmlFor="upload">
              <span className="inline-block align-middle"><Plus/></span>
              <span className="inline-block align-middle">Add</span>
            </label>
            <input id="upload" type="file" style={{width:"0.1px", opacity:"0"}}
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
        </DialogTitle>
        <div>
          {files.map((file:any,index:number)=>{
            return(
              <div key={index} className="mb-5">
                <div className="flex flex-row mb-2">
                  <span >
                    <input type="checkbox" 
                      checked={selectedFiles[index]} 
                      onChange={()=>setSelectedFiles((curr:any)=>{
                        const selected = curr[index]; 
                        curr[index]= !selected; 
                        return [...curr];
                      })} className="inline-block align-middle mt-2"
                      style={{width:"17px", height:"17px"}} 
                    />
                  </span>
                  <span className="inline-block align-middle mx-2"><img src={file.name.search(".pdf")!=-1?pdf_icon:xlsx_icon} style={{width:"36px", verticalAlign:"middle"}} /></span>
                  <div className="flex-auto">
                    <p className="text-base font-light">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size} KB</p>
                  </div>
                  <span className={`${FileStatusList[file.status]} mx-5`}> <span className="inline-block align-middle">{file.status}</span></span>
                  <span className="inline-block align-middle"><DeleteConfirmation thing="file" deleteFunction={deleteFile} currIndex={index}/></span>
                </div>
                <hr/>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FormDialogFiles; */
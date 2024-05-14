import { useState } from "react";
import { Table } from "@/components/ui/table";
import useGlobalContext from "./../../../GlobalContext";

import { PriorityValues, EnumIteratorValues, EnumIteratorKeys, TransactionDocumentTypes } from "../BasicComponents/Constants";
import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import FormDialogDocuments from "../BasicComponents/FormDialogDocuments";
import { useToast } from "@/components/ui/use-toast";

import edit_icon from "./../static/edit_icon.svg";
import delete_icon from "./../static/delete_icon.svg";
import ActionDialog from "../BasicComponents/ActionDialog";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { Toaster } from "../ui/toaster";

function LoanDocuments(props: any) {
  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData] = useState([
    { "N":2, "T":1, "P": 3, "PL":"Jaipur", "EL":"Jaipur", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":3, "T":2, "P":3, "PL":"Pune", "EL":"Pune", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":3, "T":1, "P": 1, "PL":"Surat", "EL":"Surat", "SD":"15/08/17", "ED":"15/08/17 "},
    { "N":1, "T":2, "P":2, "PL":"Surat", "EL":"Surat", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":2, "T":1, "P":2, "PL":"Pune", "EL":"Pune", "SD":"15/08/17", "ED":"15/08/17" },
  ]);
  
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);
  const [newFiles, setNewFiles] = useState<any>([]);

  const {createDocument, handleEncryption } = useGlobalContext();
  const { toast } = useToast();

  const [fieldValues, setFieldValues] = useState({
    "N":-1, "T":"",
    "SD":"", "ED":"",
    "EL":"", "PL":"",
  });
  
  const [fieldList] = useState([
    {category:"grid", row:2, fields:[
      { id: "N", name:"Document Name", type:"select", options:EnumIteratorValues(TransactionDocumentTypes), required:false },
      { id: "T", name:"Document Type", type:"select", options:["PDF","XLSX"], required:false },
    ]},
    { category:"grid", row:2, fields:[
      { id:"SD", name:"Start Date", type:"date", required:false },
      { id:"ED", name:"End Date", type:"date", required:false },
      { id:"EL", name:"Execution Location", type:"text" },
      { id:"PL", name:"Physical Location", type:"text" },
    ]},
    { category:"single", id:"P", name:"Priority", type:"select", options:EnumIteratorValues(PriorityValues), required:true },
  ]);

  const [uploadField] =useState(
    { id: "Docs", name:"Document Upload", fileList: newFiles }
  );

  const addDocument = async () =>{
    const formData = new FormData();
    const enc_data = await handleEncryption(fieldValues) || "";
    formData.append("data", enc_data);
    console.log("Cyberman");
    for (let i=0; i<newFiles.length; i++)
      formData.append("file", newFiles[i]);
    toast({
      title: "Document Successfully add",
      description: "Friday, February 10, 2023 at 5:57 PM",
      className:"bg-white"
    })
    const res = await createDocument(formData);
    console.log("Loan Document Response",res)
    return res;
  }


  const obliterateDocument = (userIndex:number) => {
    const userid=0;//get user from index
    console.log(userid+userIndex);
    /* deleteDocument(userid).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    }); */
  }

  return (
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold m-7 mt-5">{props.label}</p>
      <Toaster/>
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" />
        </div>

        <div className="flex-auto">
          <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(PriorityValues)} valueList={EnumIteratorKeys(PriorityValues)}
            setPlaceholder={true} placeholderValue={[-1,"Priority"]} 
          />
        </div>
      
        <div className="mr-3">
          <FormDialogDocuments
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`} formTitle={props.label} formSubmit={addDocument}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
          />
        </div>        
      </div> 
      <div className="m-5">
        <Table className="border rounded-3xl" style={{borderRadius:"md"}}>
          <HeaderRows className="" headingRows={[["Document Name"],["File Type"],["Priority"], ["Physical Location"],["Execution Location"], ["Start Date"],["End Date"],["Action"]]} />

          <BodyRowsMapping list={docData} columns={["N", "T", "P", "PL","EL","SD","ED"]} dataType={["transaction","file","priority","text","text","text","text","action"]}
            searchRows={searchString==""?[]:[searchString,"N"]} filterRows={priority==-1?[]:[priority,"P"]}
            action = {docData.map((item:any, index:number)=>{
              console.log(item)
              return(
                <div className="flex flex-row">
                  <FormDialogDocuments
                    triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} formTitle={props.label} formSubmit={addDocument}
                    detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
                    uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
                    edit={true} currentFields={docData[index]}
                  />
                  <ActionDialog trigger={<img src={delete_icon}/>} title="Delete Document?" description="Are you sure you want to delete this document?" 
                    actionClassName="text-white bg-red-600 rounded-lg hover:bg-red-600" actionLabel="Delete" actionFunction={obliterateDocument(index)} 
                  />
                </div>
              )
            })}
          />
        </Table>
      </div>
      <br/>
      <FormSectionNavigation isForm={false} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
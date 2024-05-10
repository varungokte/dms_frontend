import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import useGlobalContext from "./../../../GlobalContext";

import { PriorityValues, EnumIteratorValues, EnumIteratorKeys, TransactionDocumentTypes } from "../BasicComponents/Constants";
import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import FormDialog from "../BasicComponents/FormDialog";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import FormDialogDocuments from "../BasicComponents/FormDialogDocuments";

import edit_icon from "./../static/edit_icon.svg";
import delete_icon from "./../static/delete_icon.svg";
import ActionDialog from "../BasicComponents/ActionDialog";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";

function LoanDocuments(props: any) {
  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData] = useState([
    { "N":"Common Loan Agreement", "T":"PDF", "P": 3, "PL":"Jaipur", "EL":"Jaipur", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":"Lender Agent Agreement", "T":"XLSX", "P":3, "PL":"Pune", "EL":"Pune", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":"Power Purchase Agreement", "T":"PDF", "P": 1, "PL":"Surat", "EL":"Surat", "SD":"15/08/17", "ED":"15/08/17 "},
    { "N":"Lender Agent Agreement", "T":"XLSX", "P":2, "PL":"Surat", "EL":"Surat", "SD":"15/08/17", "ED":"15/08/17" },
    { "N":"Escrow Agreement", "T":"PDF", "P":2, "PL":"Pune", "EL":"Pune", "SD":"15/08/17", "ED":"15/08/17" },
  ]);
  
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);
  const [newFiles, setNewFiles] = useState<any>([]);

  const [fieldValues, setFieldValues] = useState({
    "N":"", "T":"",
    "SD":"", "ED":"",
    "EL":"", "PL":"",
  });
  
  useEffect(()=>{
    console.log("FLELIST",newFiles)
  },[newFiles])

  const [fieldList, setFieldList] = useState([
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
    { category:"single", id: "Docs", name:"Document Upload", type:"file", fileList: newFiles },
  ]);

  const addDocument = () =>{
    console.log("FIELD VALUES", fieldValues);
    console.log("FILE VALUES", newFiles);
  }

  const uploadFile = async (file:File) => {
    console.log("Received", file);
    return 200;
  }

  const editDocument = (e:any) => {
    e.preventDefault();
  }

  const deleteDocument = (e:any) => {
    e.preventDefault();
  }

  return (
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold m-7 mt-5">{props.label}</p>

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
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`}
            formTitle={props.label} formSubmit={addDocument} submitButton="Save"
            form={fieldList} setter={setFieldValues} fieldValues={fieldValues} 
            fileList={newFiles} fileSetter={setNewFiles} uploadFile={uploadFile}
          />
        </div>        
      </div>
      <div className="m-5">
        <Table className="border rounded-3xl" style={{borderRadius:"md"}}>
          <HeaderRows className="" headingRows={[["Document Name"],["File Type"],["Priority"], ["Physical Location"],["Execution Location"], ["Start Date"],["End Date"],["Action"]]} />

          <BodyRowsMapping list={docData} columns={["N", "T", "P", "PL","EL","SD","ED"]} dataType={["text","text","priority","text","text","text","text","action"]}
            searchRows={searchString==""?[]:[searchString,"N"]} filterRows={priority==-1?[]:[priority,"P"]}
            action = {docData.map((item:any, index:number)=>{
              return(
                <div className="flex flex-row">
                  <FormDialog 
                    triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>} formSize="medium"
                    formTitle="Edit User" formSubmit={editDocument} submitButton="Edit User"
                    form={fieldList} setter={setFieldValues}
                    edit={true} fieldValues={fieldValues}  currentFields={docData[index]}
                  />
                    <ActionDialog trigger={<img src={delete_icon}/>} title="Delete Document?" description="Are you sure you want to delete this document?" 
                      actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteDocument} 
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
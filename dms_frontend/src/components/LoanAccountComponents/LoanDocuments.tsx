import { useState } from "react";
import { Table } from "@/components/ui/table";

import { PriorityValues, EnumIteratorValues, EnumIteratorKeys } from "../BasicComponents/Constants";
import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import FormDialog from "../BasicComponents/FormDialog";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import edit_icon from "./../static/edit_icon.svg";
import delete_icon from "./../static/delete_icon.svg";
import ActionDialog from "../BasicComponents/ActionDialog";

function LoanDocuments(props: any) {
  //SHOULD GET DOCDATA FROM props.docData

  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData] = useState([
    ["Common Loan Agreement", 2, "Jaipur", "Jaipur", "15/08/17", "15/08/17"],
    ["Lender Agent Agreement", 2, "Pune", "Pune",  "15/08/17", "15/08/17"],
    ["Power Purchase Agreement", 0, "Surat", "Surat", "15/08/17", "15/08/17"],
    ["Lender Agent Agreement", 1, "Surat", "Surat",  "15/08/17", "15/08/17"],
    ["Escrow Agreement", 1, "Pune", "Pune",  "15/08/17", "15/08/17"],
  ]);
  
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(-1);

  
  const [newDocName, setNewDocName] = useState("");
  const [newFiles, setNewFiles] = useState<any>([]);
  const [newDocType, setNewDocType] = useState(-1)
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newExeLoc, setNewExeLoc] = useState("");
  const [newPhyLoc, setNewPhyLoc] = useState("");
  const [newPriority, setNewPriority] = useState(-1);
  
  const addDocument = (e:any) =>{
    e.preventDefault();
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
          <FormDialog
            triggerText="Add"
            triggerClassName={PurpleButtonStyling}
            formTitle={props.label}
            formSubmit={addDocument}
            submitButton="Save"
            form={[
              {category:"grid", row:2, fields:[
                {label:"Document Name", type:"text", setter:setNewDocName},
                {label:"Document Type", type:"select", setter:setNewDocType, options:["PDF","XLSX"]},
              ]},
              {category:"single", label:"Upload Document", type:"file", setter:setNewFiles, fileList: newFiles},
              {category:"grid", row:2, fields:[
                {label:"Start Date", type:"date", setter:setNewStartDate},
                {label:"End Date", type:"date", setter:setNewEndDate},
                {label:"Execution Location", type:"text", setter:setNewExeLoc},
                {label:"Physical Location", type:"text", setter:setNewPhyLoc},
              ]},
              {category:"single", label:"Priority", type:"select", setter:setNewPriority, options:EnumIteratorValues(PriorityValues)}
            ]}
          />
        </div>        
      </div>
      <div className="m-5">
        <Table>
          <HeaderRows headingRows={[["Document Name"],["Priority"], ["Physical Location"],["Execution Location"], ["Start Date"],["End Date"],["Action"]]} />

          <BodyRowsMapping list={docData} dataType={["text","priority","text","text","text","text","action"]}
            searchRows={searchString==""?[]:[searchString,0]} filterRows={priority==-1?[]:[priority,1]}
            action = {docData.map((item:any, index:number)=>{
              return(
                <div className="flex flex-row">
                  <FormDialog 
                    triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                    formTitle="Edit User" formSubmit={editDocument}  submitButton="Edit User"
                    form={[
                      {category:"grid", row:2, fields:[
                        {label:"Document Name", type:"text", setter:setNewDocName},
                        {label:"Document Type", type:"select", setter:setNewDocType, options:["PDF","XLSX"]},
                      ]},
                      {category:"single", label:"Upload Document", type:"file", setter:setNewFiles, fileList: newFiles},
                      {category:"grid", row:2, fields:[
                        {label:"Start Date", type:"date", setter:setNewStartDate},
                        {label:"End Date", type:"date", setter:setNewEndDate},
                        {label:"Execution Location", type:"text", setter:setNewExeLoc},
                        {label:"Physical Location", type:"text", setter:setNewPhyLoc},
                      ]},
                      {category:"single", label:"Priority", type:"select", setter:setNewPriority, options:EnumIteratorValues(PriorityValues)}
                    ]}
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
    </div>
  )
}

export default LoanDocuments;
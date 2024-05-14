import { useState } from "react";
import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter";
import { CovenantType, EnumIteratorKeys, EnumIteratorValues, FrequencyType, PriorityValues } from "../BasicComponents/Constants";
import FormDialog from "../BasicComponents/FormDialog";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { Table } from "../ui/table";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import edit_icon from "./../static/edit_icon.svg";
import delete_icon from "./../static/delete_icon.svg";
import ActionDialog from "../BasicComponents/ActionDialog";
import FormDialogDocuments from "../BasicComponents/FormDialogDocuments";
import useGlobalContext from "./../../../GlobalContext";

function LoanCovenants(props:any){
  const [searchString, setSearchString] = useState("");
  const [priority, setPriority] = useState(1);
  const [newFiles, setNewFiles] = useState<any>([]);

  const [documentList] = useState([
    { "T":1, "D": "An example of a periodic covenant", "F":2, "SD":"1/2/3", "ED":"2/2/3" },
    { "T":2, "D": "An example of an event-based covenant", "P":2 }
  ]);

  const [fieldValues, setFieldValues] = useState({});

  const [fieldList] = useState([
    {category:"grid", row:2, fields:[
      { id: "T", name:"Covenant Type", type:"select", options:EnumIteratorValues(CovenantType) },
      { id: "P", name:"Priority", type:"select", options:EnumIteratorValues(PriorityValues)},
    ]},
    { category:"grid", row:2, fields:[
      { id:"EL", name:"Execution Location", type:"text" },
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"SD", name:"Start Date", type:"date", dependsOn:"T", dependsValue:1 },
      { id:"ED", name:"End Date", type:"date", dependsOn:"T", dependsValue:1 },
      { id:"F", name:"Frequency", type:"select", options:EnumIteratorValues(FrequencyType), dependsOn:"T", dependsValue:1 },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ]);

  const [uploadField] = useState(
    { category:"single", id: "U", name:"Upload Document", type:"file", }
  );

  const addCovenant = (e:any) => {
    e.preventDefault();
  };

  const editCovenant = (e:any) => {
    e.preventDefault();
  };

  const deleteCovenant = (userIndex:number) => {
    const userid=0//get user from userIndex
  }

  return(
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold m-7 mt-5">Covenants</p>

      <div className="flex flex-row">
        <div>
          <Search setter={setSearchString} label="Search" />
        </div>

        <div className="flex-auto">
          <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(CovenantType)} valueList={EnumIteratorKeys(CovenantType).map(val=>{return Number(val)+1})}
          />
        </div>

        <div className="mr-3">
          <FormDialogDocuments
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`}
            formTitle={props.label} formSubmit={addCovenant}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
          />
        </div>
      </div>

      <div className="m-5">
        <Table>
          {priority==1
            ?<><HeaderRows headingRows={[["Description"],["Frequency"], ["Start Date"],["End Date"], ["Action"]]} />
              <BodyRowsMapping
                list={documentList.filter(document=>document["T"]==1)} columns={["D", "F", "SD", "ED"]} dataType={["text", "frequency", "text", "text", "action"]}
                searchRows={[]} filterRows={[]}
                action = {documentList.filter(document=>document["T"]==1).map((item:any, index:number)=>{
                  return(
                    <div className="flex flex-row">
                      <FormDialog 
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>} formSize="medium"
                        formTitle="Edit User" formSubmit={editCovenant} submitButton="Edit User"
                        form={fieldList} setter={setFieldValues}
                        edit={true} fieldValues={fieldValues}  currentFields={documentList[index]}
                      />
                      <ActionDialog trigger={<img src={delete_icon}/>} title="Delete Document?" description="Are you sure you want to delete this document?" 
                        actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteCovenant} 
                      />
                    </div>
                  )
                })}
              />
            </>
            :<><HeaderRows headingRows={[["Description"], ["Priority"], ["Action"]]} />
              <BodyRowsMapping list={documentList.filter(document=>document["T"]==2)} columns={["D", "P"]} dataType={["text", "priority", "action"]}
                searchRows={[]} filterRows={[]}
                action = {documentList.filter(document=>document["T"]==2).map((item:any, index:number)=>{
                  return(
                    <div className="flex flex-row">
                      <FormDialog 
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>} formSize="medium"
                        formTitle="Edit User" formSubmit={editCovenant} submitButton="Edit User"
                        form={fieldList} setter={setFieldValues}
                        edit={true} fieldValues={fieldValues}  currentFields={documentList[index]}
                      />
                      <ActionDialog trigger={<img src={delete_icon}/>} title="Delete Document?" description="Are you sure you want to delete this document?" 
                        actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteCovenant(index)} 
                      />
                    </div>
                  )
                })}
              />
            </>
          }
        </Table>
      </div>
    </div>
  )
}

export default LoanCovenants;
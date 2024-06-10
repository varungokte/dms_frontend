import { useEffect, useState } from "react";
import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { Table } from "../ui/table";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import edit_icon from "./../static/edit_icon.svg";
import DeleteConfirmation from "../BasicComponents/DeleteConfirmation";
import { ConditionPrecedentTypes, EnumIteratorValues, PriorityValues } from "../BasicComponents/Constants";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import useGlobalContext from "../../../GlobalContext";
import LoadingMessage from "../BasicComponents/LoadingMessage";

function LoanConditions(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}){
  
  const [newFiles, setNewFiles] = useState<any>([]);
  const [conData,setConData] = useState<any>();

  const [fieldList] = useState([
    { category:"single", id:"N", name:"Condition Name", type:"text" },
    { category:"grid", row:2, fields:[
      { id:"C", name:"Condition Category", type:"select", options:ConditionPrecedentTypes },
      { id:"P", name: "Priority", type:"select", options:EnumIteratorValues(PriorityValues)},
      { id:"SD", name:"Start Date", type:"date" },
      { id:"ED", name:"End Date", type:"date" },
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"EL", name:"Execution Location", type:"text" },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ]);

  const [added, setAdded] = useState(true);

  const [fieldValues, setFieldValues] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  
  const [uploadField] = useState(
    { id: "Docs", name:"Document Upload", fileList: fileList }
  );

  const { addDocument, getDocumentsList } = useGlobalContext();

  useEffect(()=>{
    if (added){
      setFileList([]);
      showList();
      setAdded(false);
    }
  },[added]);

  const showList = ()=>{
    getDocumentsList(props.loanId,props.label=="Condition Precedent"?"CP":"CS").then(res=>{
      if (res.status==200){console.log(res.obj)
        setConData(res.obj)}
      else
        setConData([{N:5,P:1,SD:"23/12/12",ED:"29/12/12", PL:"Coruscant", EL:"Sundari"}])  
    }).catch(()=>{
      setConData([]);
    })
  }

  const uploadFile = () => {
    /* const formData = new FormData();
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i][0]);
      //const res = await addDocument(formData); */
  }

  const createCondition = async (userValues:any) =>{
    userValues["_loanId"] = props.loanId;
    userValues["SN"] = props.label=="Condition Precedent"?"CP":"CS";

    console.log("SUBMITTED", userValues);
    
    const res = await addDocument(userValues);

    if (res.status==200){
      setAdded(true);
      setFieldValues({});
    }
    return res;
  }

  const deleteCondtion = (userIndex:number) => {
    const userid=0//get user from userIndex
    console.log(userIndex,userid);
  }

  return ( 
    <div className="bg-white rounded-xl">
      <br/>
      {/* <p className="text-2xl font-bold m-7 mt-5">Covenants</p> */}

      <div className="flex flex-row">
        {/* <div>
          <Search setter={setSearchString} label="Search" />
        </div> */}

        <div className="flex-auto">
          {/* <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(CovenantType)} valueList={EnumIteratorKeys(CovenantType).map(val=>{return Number(val)+1})}
          /> */}
        </div>

        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type="con" currentFields={fieldValues}
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} formTitle={props.label} 
            detailSubmit={createCondition} fileSubmit={uploadFile} deleteFile={deleteCondtion} getFiles={()=>{}}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
          />
        </div>
      </div>
      <br/>
      <div className="">
        {conData
          ?conData.length==0
          ?<EmptyPageMessage sectionName="conditions" />
          :<Table className="border rounded-2xl">
            <HeaderRows headingRows={["Condition Name", "Priority", "Phyical Location", "Execution Location", "Start Date","End Date", "Action"]} />
            <BodyRowsMapping
              list={conData} columns={["N","P","PL","EL", "SD", "ED"]} dataType={["text","priority", "text","text", "text", "text", "action"]}
              searchRows={[]} filterRows={[]}
              action = {conData.map((item:any, index:number)=>{
                item;
                return(
                  <div className="flex flex-row">
                    <FormDialogDocuments key={index} index={index} edit={true} type="con" 
                      triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} formTitle={props.label} detailSubmit={createCondition} fileSubmit={uploadFile}
                      detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues} deleteFile={deleteCondtion} getFiles={()=>{}}
                      uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
                      currentFields={conData[index]}
                    />
                    <DeleteConfirmation thing="covenant" deleteFunction={deleteCondtion} currIndex={index}/>
                  </div>
                )
              })}
            />
          </Table>
          :<LoadingMessage sectionName="list" />
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )

}


export default LoanConditions;
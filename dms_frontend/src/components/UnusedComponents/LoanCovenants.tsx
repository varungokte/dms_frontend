import { useEffect, useState } from "react";

import FormDialogDocuments from "../FormComponents/FormDialogDocuments";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import Filter from "../BasicComponents/Filter";
//import Search from "../BasicComponents/Search";

import { CovenantDocumentTypes, CovenantType, EnumIteratorKeys, EnumIteratorValues, FrequencyType, PriorityValues } from "../../../Constants";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import useGlobalContext from "../../../GlobalContext";
import { toast } from "../ui/use-toast";

function LoanCovenants(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}){
  const [covData, setCovData] = useState<any>();
  
  const [fieldList] = useState([
    { category:"grid", row:2, fields:[
      { id:"N", name:"Covenant Name", type:"text", required:true },
      { id:"T", name:"Covenant Type", type:"select", options:EnumIteratorValues(CovenantType), required:true },
      { id:"C", name:"Category Type", type:"select", options:EnumIteratorValues(CovenantDocumentTypes), required:true},
      { id:"P", name:"Priority", type:"select", options:EnumIteratorValues(PriorityValues), required:true},
    ]},
    { category:"single", id:"F", name:"Frequency", type:"select", options:EnumIteratorValues(FrequencyType), dependsOn:"T", dependsValue:1 },
    { category:"grid", row:2, fields:[  
      { id:"EL", name:"Execution Location", type:"text" },
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"SD", name:"Start Date", type:"date", dependsOn:"T", dependsValue:1, required:true },
      { id:"ED", name:"End Date", type:"date", dependsOn:"T", dependsValue:1, required:true },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ]);

  const [uploadField] = useState(
    { category:"single", id: "U", name:"Upload Document", type:"file", }
  );

  const [fieldValues, setFieldValues] = useState<any>({});

  const {addDocument, getDocumentsList, uploadFile} = useGlobalContext();

  const [priority, setPriority] = useState(1);
  const [newFiles, setNewFiles] = useState<any>([]);
  const [added,setAdded] = useState(true);

  //const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    if (added){
      showList();
      priority;
      setAdded(false);
    }
  },[added]);

  const showList = ()=>{
    getDocumentsList(props.loanId,"C").then(res=>{
      if (res.status==200){console.log(res.obj)
        setCovData(res.obj)}
      else
        setCovData([{N:5,P:1,SD:"23/12/12",ED:"29/12/12", PL:"Coruscant", EL:"Sundari"}])  
    }).catch(()=>{
      setCovData([]);
    })
  }

  const addCovenant = async (userValues:any) => {
    if (userValues["F"] && userValues["T"]!=1)
      delete userValues["F"];

      userValues["_loanId"] = props.loanId;
      userValues["SN"] = "C";
  
      console.log("SUBMITTED", userValues);
      
      const res = await addDocument(userValues);
  
      if (res.status==200){
        setAdded(true);
        setFieldValues({});
        toast({
          title: "Success!",
          description: "Your document has been successfully added",
          className:"bg-white"
        })
      }
      return res;

  };

  const sendFile = async (userFiles:any, docId:string) => {
    console.log("reached sendfile", docId);
    const formData = new FormData();
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i][0]);
      const res = await uploadFile(formData, `${props.AID}/C`,docId);
      return res;
  }

  /* const editCovenant = (e:any) => {
    e.preventDefault();
  };

  const deleteCovenant = (userIndex:number) => {
    const userid=0//get user from userIndex
    console.log(userIndex,userid);
  } */

  return(
    <div className="bg-white rounded-xl">
      <br/>
			{/* <p className="text-2xl font-bold m-7 mt-5">Covenants</p> */}

      <div className="flex flex-row">
        {/* <div>
          <Search setter={setSearchString} label="Search" />
        </div> */}

        <div className="flex-auto">
          <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(CovenantType)} valueList={EnumIteratorKeys(CovenantType).map(val=>{return Number(val)+1})}
          />
        </div>

        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type="cov"
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`} formTitle={props.label} 
            detailSubmit={addCovenant} fileSubmit={sendFile} deleteFile={()=>{}} getFiles={()=>{}}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
            currentFields={fieldValues}
          />
        </div>
      </div>
      <br/>
      <div className="">
        {covData
          ?covData.length==0
            ?<EmptyPageMessage sectionName="covenants" />
            :<></>
              
          :<LoadingMessage sectionName="covenants list" />
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanCovenants;
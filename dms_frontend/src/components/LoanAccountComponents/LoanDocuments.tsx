import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import useGlobalContext from "./../../../GlobalContext";

import { PriorityValues, EnumIteratorValues, TransactionDocumentTypes, ComplianceDocumentTypes } from "../BasicComponents/Constants";
/* import Search from "../BasicComponents/Search";
import Filter from "../BasicComponents/Filter"; */
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import FormDialogDocuments from "../BasicComponents/FormDialogDocuments";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "../ui/toaster";

import edit_icon from "./../static/edit_icon.svg";
import DeleteConfirmation from "../BasicComponents/DeleteConfirmation";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";

function LoanDocuments(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}) {
  const [docData, setDocData] = useState<any>([]);
  
  const [sectionDetails] = useState(props.label=="Transaction Documents"
    ?{ docNameList: TransactionDocumentTypes, sectionName: "TD", }
    :{ docNameList: ComplianceDocumentTypes, sectionName: "CD", }
  );
  
  //const [searchString, setSearchString] = useState("");
  //const [priority, setPriority] = useState(-1);
  const [docPath] = useState([props.AID,sectionDetails.sectionName, props.loanId]);
  
  const {createDocument, handleEncryption, getDocumentsList, editDocument } = useGlobalContext();
  const { toast } = useToast();

  const [added, setAdded] = useState(true);

  const [fieldValues, setFieldValues] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  
  const [fieldList] = useState([
    { category:"grid", row:2, fields:[
      { id:"N", name:"Document Name", type:"select", options:EnumIteratorValues(sectionDetails.docNameList), required:false, immutable:true },
      { id:"P", name:"Priority", type:"select", options:EnumIteratorValues(PriorityValues), required:true },
      { id:"SD", name:"Start Date", type:"date", required:false },
      { id:"ED", name:"End Date", type:"date", required:false },
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"EL", name:"Execution Location", type:"text" },
    ]},    
  ]);
  const [uploadField] = useState(
    { id: "Docs", name:"Document Upload", fileList: fileList }
  );

  useEffect(()=>{
    if (added){
      showList();
      setAdded(false);
    }
  },[added]);

  const showList = ()=>{
    getDocumentsList(props.loanId,sectionDetails.sectionName).then(res=>{
      if (res.status==200){console.log(res.obj)
        setDocData(res.obj)}
      else
        setDocData([{N:5,P:1,SD:"23/12/12",ED:"29/12/12", PL:"Coruscant", EL:"Sundari"}])  
    }).catch(()=>{
      setDocData([]);
    })
  }

  const addDocument = async (userValues:any, userFiles:any) =>{
    console.log("here's what will be sent", userValues, userFiles);

    const formData = new FormData();
    userValues["_loanId"] = props.loanId;
    userValues["LOC"] = `${docPath[0]}/${docPath[1]}/${TransactionDocumentTypes[Number(userValues["N"])]}`;
    const enc_data = await handleEncryption(userValues) || "";
    formData.append("data", enc_data);
    for (let i=0; i<userFiles.length; i++)
      formData.append("file", userFiles[i][0]);
    
    const res = await createDocument(formData);

    if (res==200){
      setAdded(true);
      setFieldValues({});
      toast({
        title: "Success!",
        description: "Your document has been successfully added",
        className:"bg-white"
      })
    }
    return res;
  }

  const changeDocument = async (userValues:any, userFiles:any,currIndex:number) => {
    console.log("on edit curr index", currIndex)
    console.log("on edit field values", userValues);
    console.log("on edit file list", uploadField);
    console.log("preexisitng data", docData[currIndex])

    const formData = new FormData();
    const data:any={};

    for (let i=0; i<Object.keys(userValues).length; i++){
      const key = Object.keys(userValues)[i];
      const val = userValues[key];
      console.log(key,val,docData[currIndex][key])
      if (docData[currIndex][key]==val)
        continue;
      data[key] = val;
    }
    console.log("Data value",data)
    if (Object.keys(data).length!=0 || Object.keys(userFiles[0]).length!=0 )
    {
      data["LOC"] = `${props.AID}/${sectionDetails.sectionName}/${TransactionDocumentTypes[Number(docData[currIndex]["N"])]}`;
      data["_loanId"] = props.loanId;
      data["_id"] = docData[currIndex]["_id"];

      console.log("final data",data)
    
      const enc_data = await handleEncryption(data) || "";
      formData.append("data", enc_data);
      if (userFiles.length!=0)
        for (let i=0; i<userFiles.length; i++){
          console.log("file",i,userFiles[i][0])
          formData.append("file", userFiles[i][0]);
        }

      console.log ("EDITTED", data)
      const res = await editDocument(formData);
      setFieldValues({});

      if (res==200){
        setAdded(true);
        setFieldValues({});
        toast({
          title: "Success!",
          description: "Your document has been successfully updated",
          className:"bg-white"
        })
      }

      return res;
    }
    return 200;
  }

  const obliterateDocument = (index:number) => {
    toast({
      title: "Success!",
      description: "Your document has been successfully deleted",
      className:"bg-white"
    })
    /* deleteDocument(userid).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    }); */
    console.log(index);
  }

  return (
    <div className="bg-white rounded-xl">
      <br/>
			{/* <p className="text-2xl font-bold m-7 mt-5">{props.name}</p> */}
      <Toaster/>
      <div className="flex flex-row">
        <div className=''>
          {/* <Search setter={setSearchString} label="Search" /> */}
        </div>

        <div className="flex-auto">
          {/* <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(PriorityValues)} valueList={EnumIteratorKeys(PriorityValues)}
            setPlaceholder={true} placeholderValue={[-1,"Priority"]} 
          /> */}
        </div>
      
        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type={sectionDetails.sectionName}
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} formTitle={props.label} formSubmit={addDocument}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setFileList} fileList={fileList}
            currentFields={{}} docPath={docPath}
          />
        </div>
      </div> 
      <div className="m-5">
        {docData.length==0?<EmptyPageMessage sectionName="documents" />
          :<Table className="border rounded-3xl" style={{borderRadius:"md"}}>
            <HeaderRows headingRows={["Document Name", "Priority", "Physical Location", "Execution Location", "Start Date", "End Date", "Action"]} />
            <BodyRowsMapping list={docData} columns={["N", "P", "PL","EL","SD","ED"]} dataType={["transaction","priority","text","text","date","date","action"]}
              searchRows={[]/* searchString==""?[]:[searchString,"N"] */} filterRows={[]/* priority==-1?[]:[priority,"P"] */}
              action = {docData.map((item:any, index:number)=>{
                item;
                return(
                  <div className="flex flex-row">
                    <FormDialogDocuments key={index} index={index} edit={true} type={sectionDetails.sectionName}
                      triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} formTitle={props.label} formSubmit={changeDocument}
                      detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
                      uploadForm={uploadField} fileSetter={setFileList} fileList={fileList}
                      currentFields={docData[index]} currIndex={index} docPath={docPath}
                    />
                    <DeleteConfirmation thing="document" deleteFunction={obliterateDocument} currIndex={index}/>
                  </div>
                )
              })}
            />
          </Table>
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
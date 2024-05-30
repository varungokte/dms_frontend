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
  //docData is an array of documents
  //Each document is a array: [Document Name, Priority, Physical Location, Execution Location, Start Date, End Date, Status]
  const [docData, setDocData] = useState<any>([
    {N:1, P:2, SD:"A", ED:"B", EL:"EL", }
  ]);
  
  const [specificDetails] = useState(props.label=="Transaction Documents"
    ?{
      docNameList: TransactionDocumentTypes,
      sectionName: "TD",
    }
    :{
      docNameList: ComplianceDocumentTypes,
      sectionName: "CD",
    });
  
  //const [searchString, setSearchString] = useState("");
  //const [priority, setPriority] = useState(-1);
  const [newFiles, setNewFiles] = useState<any>([{}]);

  const {createDocument, handleEncryption, getDocumentsList, fetchDocument } = useGlobalContext();
  const { toast } = useToast();

  const [fieldValues, setFieldValues] = useState<any>({
    N:-1, P:-1,
    SD:"", ED:"",
    EL:"", PL:"",
  });

  const [showDoc, setShowDoc] = useState(<></>)

  useEffect(()=>{
    console.log("fetching the document",props.AID, specificDetails.sectionName,TransactionDocumentTypes[Number(3)],"1716803032797-data2.pdf");
    fetchDocument(props.AID, specificDetails.sectionName,TransactionDocumentTypes[Number(3)],"1716803032797-data2.pdf").then(res=>{
      console.log(res);
      setShowDoc(<iframe src={res.url} width="100%" height="600px" title="Document Viewer"></iframe>)
    }).catch(err=>{
      console.log("an error", err)
    })
  },[])

  useEffect(()=>{
    console.log("the filed valiues in the loan page", fieldValues);
  },[fieldValues])
  
  const [fieldList] = useState([
    { category:"grid", row:2, fields:[
      { id:"N", name:"Document Name", type:"select", options:EnumIteratorValues(specificDetails.docNameList), required:false, immutable:true },
      { id:"P", name:"Priority", type:"select", options:EnumIteratorValues(PriorityValues), required:true },
      { id:"SD", name:"Start Date", type:"date", required:false },
      { id:"ED", name:"End Date", type:"date", required:false },
      { id:"EL", name:"Execution Location", type:"text" },
      { id:"PL", name:"Physical Location", type:"text" },
    ]},
    
  ]);

  const [uploadField] = useState(
    { id: "Docs", name:"Document Upload", fileList: newFiles }
  );

  const addDocument = async () =>{
    const formData = new FormData();
    fieldValues["_loanId"]=props.loanId;
    console.log("the name", fieldValues["N"]);
    fieldValues["LOC"]=`${props.AID}/${specificDetails.sectionName}/${TransactionDocumentTypes[Number(fieldValues["N"])]}`;
    console.log("the loc",fieldValues["LOC"])
    const enc_data = await handleEncryption(fieldValues) || "";
    
    formData.append("data", enc_data);
    for (let i=0; i<newFiles.length; i++)
      formData.append("file", newFiles[i]);
    
    console.log("the path of the trans doc", Number(fieldValues["N"]), TransactionDocumentTypes[Number(fieldValues["N"])]);
    
    const res =  await createDocument(formData);
    
    setFieldValues({});

    if (res==200){
      toast({
        title: "Success!",
        description: "Your document has been successfully added",
        className:"bg-white"
      })
    }
    return res;
  }

  useEffect(()=>{
    showList();
  },[])

  const showList=()=>{
    getDocumentsList(props.AID,specificDetails.sectionName, TransactionDocumentTypes[Number(3)]).then(res=>{
        if (res.status==200)
          setDocData([]/* res.obj */)
        else
          setDocData([])
        
    }).catch(()=>{
      setDocData([]);
    })
  }

  const editDocument = () => {
    console.log("EDITING")
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
    console.log(index)
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
          <FormDialogDocuments key={-5} index={-5} edit={false} type="doc"
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} formTitle={props.label} formSubmit={addDocument}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
            currentFields={fieldValues}
          />
        </div>
      </div> 
      <div className="m-5">
        {docData.length==0?<EmptyPageMessage sectionName="documents" />
          :<Table className="border rounded-3xl" style={{borderRadius:"md"}}>
            <HeaderRows headingRows={[["Document Name"],["Priority"], ["Physical Location"],["Execution Location"], ["Start Date"],["End Date"],["Action"]]} />
            <BodyRowsMapping list={docData} columns={["N", "P", "PL","EL","SD","ED"]} dataType={["transaction","priority","text","text","text","text","action"]}
              searchRows={[]/* searchString==""?[]:[searchString,"N"] */} filterRows={[]/* priority==-1?[]:[priority,"P"] */}
              action = {docData.map((item:any, index:number)=>{
                item;
                return(
                  <div className="flex flex-row">
                    <FormDialogDocuments key={index} index={index} edit={true} type="doc"
                      triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} formTitle={props.label} formSubmit={editDocument}
                      detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
                      uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
                      currentFields={docData[index]}
                    />
                    <DeleteConfirmation thing="document" deleteFunction={obliterateDocument} currIndex={index}/>
                  </div>
                )
              })}
            />          
          </Table>
        }
      </div>
      {showDoc}
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanDocuments;
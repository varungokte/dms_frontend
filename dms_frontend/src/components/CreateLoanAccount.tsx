import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";

import ContactDetails from "./LoanAccountComponents/ContactDetails";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import RelationshipMapping from "./LoanAccountComponents/RelationshipMapping";
import BasicDetails from "./LoanAccountComponents/BasicDetails";
import SecurityDetails from "./LoanAccountComponents/SecurityDetails";
import BankDetails from "./LoanAccountComponents/BankDetails";

//import { ChevronLeft, ChevronRight } from "lucide-react";

import GenerateLoanID from "./LoanAccountComponents/GenerateLoanID";
import { useLocation } from "react-router-dom";
import useGlobalContext from "./../../GlobalContext";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { FieldValues } from "DataTypes";

function CreateLoanAccount() {
  const {state} = useLocation();

  const {getLoanFields, useTitle} = useGlobalContext();

  useTitle(`${(state.linkSource.charAt(0).toUpperCase()+state.linkSource.toLowerCase().slice(1))} Loan Account`)
  
  const [actionType] = useState<"CREATE"|"EDIT">(state.linkSource);

  const [loanId, setLoanId] = useState(state.linkSource=="CREATE"?"":state.loanId);
  const [AID, setAID] = useState(state.linkSource=="CREATE"?"":state.AID);
  const [currentSection, setCurrentSection] = useState(state.linkSource=="CREATE"?0:1);

  const [preexistingData, setPreexistingData] = useState<FieldValues>();
  
  const [okToFrolic, setOkToFrolic] = useState(state.linkSource=="CREATE"?false:true); //When false, user cannot go to other pages
  const [unsavedWarning, setUnsavedWarning] = useState(false); //when true, user will get a pop-up warning
  
  const [showSecurityDetails, setShowSecurityDetails] = useState(true);
  const [dataHasLoaded, setDataHasLoaded] = useState(state.linkSource=="CREATE"?true:false);

  const [formSections] = useState([
    { name: "Create Agreement ID", component: GenerateLoanID },
    { name: "Basic Details", component: BasicDetails },
    { name: "Security Details", component: SecurityDetails, show: showSecurityDetails },
    { name: "Bank Details", component: BankDetails },
    { name: "Ratings", component: Ratings },
    { name: "Contact Details", component: ContactDetails },
    { name: "Relationship Mapping", component: RelationshipMapping },
    { name: "Transaction Documents", component: LoanDocuments },
    { name: "Compliance Documents", component: LoanDocuments },
    { name: "Covenants", component: LoanDocuments },
    { name: "Condition Precedent", component: LoanDocuments },
    { name: "Condition Subsequent", component: LoanDocuments },
  ]);

  const getOldData = async () => {
    const res = await getLoanFields(loanId);
    console.log("preexisting data",res);
    if (res["ST"] && res["ST"]==2)
      setShowSecurityDetails(false);
    if (res["CN"])
      setPreexistingData(res);
    setDataHasLoaded(true);
  }

  useEffect(()=>{
    if (actionType=="EDIT")
      getOldData();
  },[]);
  
  /* useEffect(()=>{
    if (actionType=="CREATE" && currentSection>0 && currentSection<5)
      getOldData();
  },[currentSection]) */


  const goToNextSection = async () => {
    if (currentSection>0 && currentSection<5)
      await getOldData();
    const sectionCount = formSections.length-1;
    setCurrentSection((curr)=>{
      if (curr===sectionCount) return sectionCount 
      else return curr+1
    });
  };
	
  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2 page-heading">{(actionType.charAt(0).toUpperCase()+actionType.toLowerCase().slice(1))} Loan Account</p>
      {AID?<p className="mx-7 mt-3 text-lg"><span className="font-normal">Agreement ID: </span><span className="text-custom-1">{AID}</span></p>:""}
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
        <div className="flex flex-row" style={{position:"relative"}}>
          {/* <button><ChevronLeft className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={previousSection} /></button> */}
            <div style={{ width: '100%', overflowX: 'scroll', whiteSpace: 'nowrap' }}>

            <TooltipProvider>
              {formSections.map((section, index:number)=>{
                return(
                  <Tooltip key={index}>
                      <TooltipTrigger key={index} disabled={!okToFrolic || index==0}
                        className={`py-3 px-2 border-2 border-zinc-300 rounded-xl m-3 min-w-44 ${currentSection===index?"bg-custom-1 text-white":index===0?"text-slate-400 border-zinc-200":"white"}`} 
                        onClick={()=>{
                          unsavedWarning
                            ?(confirm("WARNING:\nYou have unsaved data which will be lost.\nTo save your data, close this dialog and click the Save & Next button")
                              ?setCurrentSection(index):"")
                            :setCurrentSection(index)                      
                        }}
                      >
                        <div className="flex flex-row">
                          <div className={`border rounded-full ${index===0?(currentSection===index?"border-white":"border-slate-300"):currentSection===index?"border-white":"border-black"}`} 
                            style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>{`${index+1}.`}</div>
                          <div className="m-auto">{section.name}</div>
                        </div>
                      </TooltipTrigger>
                    {!okToFrolic && currentSection==1 && index>1
                    ?<TooltipContent className="bg-white">
                      <p className="">Please fill all <span className="font-bold">required fields</span> to move to this page</p>
                    </TooltipContent>
                    :<></>}
                  </Tooltip>
                )
              })}
              </TooltipProvider>
            </div>
          {/* <button><ChevronRight className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={nextSection}/></button> */}
        </div>

        <div className="mx-10">
          {dataHasLoaded?
            React.createElement (formSections[currentSection].component, 
            {
              key:currentSection,
              actionType: actionType,
              loanId: loanId,
              setLoanId: setLoanId,
              AID: AID,
              setAID: setAID,
              currentSection: currentSection,
              setCurrentSection: setCurrentSection,
              goToNextSection: goToNextSection,
              setUnsavedWarning: setUnsavedWarning,
              label: formSections[currentSection].name,
              setShowSecurityDetails: (formSections[currentSection].name=="Basic Details")?setShowSecurityDetails:()=>{},
              showSecurityDetails: (formSections[currentSection].name=="Security Details")?showSecurityDetails:false,
              setOkToFrolic: currentSection<2?setOkToFrolic:()=>{},
              preexistingValues: preexistingData||{},
            }
          ):<LoadingMessage sectionName="details" />} 
        </div>
      </div> 
    </div>
  )
}

export default CreateLoanAccount;
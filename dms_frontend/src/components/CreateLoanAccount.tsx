import React, { useEffect, useState } from "react";

import ContactDetails from "./LoanAccountComponents/ContactDetails";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import RelationshipMapping from "./LoanAccountComponents/RelationshipMapping";
import BasicDetails from "./LoanAccountComponents/BasicDetails";
import SecurityDetails from "./LoanAccountComponents/SecurityDetails";
import BankDetails from "./LoanAccountComponents/BankDetails";

import { ChevronLeft, ChevronRight } from "lucide-react";

import GenerateLoanID from "./LoanAccountComponents/GenerateLoanID";
import { useLocation } from "react-router-dom";
import useGlobalContext from "./../../GlobalContext";

function CreateLoanAccount() {
  const {state} = useLocation();
  
  const {getLoanFields} = useGlobalContext();

  const [actionType] = useState(state.linkSource);

  const [loanId, setLoanId] = useState(state.linkSource=="CREATE"?"":state.loanId);
  const [AID, setAID] = useState(state.AID);
  const [preexisting, setPreexisting] = useState([]);

  const [currentSection, setCurrentSection] = useState(state.linkSource=="CREATE"?0:1);

  const [okToFrolic, setOkToFrolic] = useState(state.linkSource=="CREATE"?false:true);

  const [showSecurityDetails, setShowSecurityDetails] = useState(true);

  const [loadingData, setLoadingData] = useState(state.linkSource=="CREATE"?true:false)

  useEffect(()=>{
    if (actionType=="EDIT"){
      getLoanFields(loanId).then(res=>{
        console.log("PRE EXISTING FIELDS",res);
        setPreexisting(res);
        setLoadingData(true);
      })
    }
  },[]);

  const goToNextSection = () => {
    const sectionCount = formSections.length-1;
    setCurrentSection((curr:any)=>{
      if (curr===sectionCount) return sectionCount 
      else return curr+1
    });
  };

  const [formSections] = useState([
    { name: "Create Agreement ID", component: GenerateLoanID },
    { name: "Basic Details", component: BasicDetails },
    { name: "Security Details", component: SecurityDetails, show: showSecurityDetails},
    { name: "Bank Details", component: BankDetails},
    { name: "Contact Details", component: ContactDetails},
    { name: "Relationship Mapping", component: RelationshipMapping},
    { name: "Transaction Documents", component: LoanDocuments, label: "Transaction Documents"},
    { name: "Compliance Documents", component: LoanDocuments, label: "Compliance Documents"},
    { name: "Ratings", component: Ratings }
  ])
	
  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2">{(actionType.charAt(0).toUpperCase()+actionType.toLowerCase().slice(1))} Loan Account</p>
      {AID?<p className="mx-7 mt-3 text-lg"><span className="font-normal">Agreement ID: </span><span className="text-custom-1">{AID}</span></p>:""}
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
        <div className="flex flex-row" style={{position:"relative"}}>
          <button><ChevronLeft className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} /* onClick={previousSection} */ /></button>
            <div style={{ width: '100%', overflowX: 'scroll', whiteSpace: 'nowrap' }}>
              {formSections.map((section:any, index:number)=>{
                return(
                  <button key={index} disabled={!okToFrolic || index==0} className={`py-3 px-2 border-2 border-zinc-300 rounded-xl m-3 min-w-44 ${currentSection===index?"bg-custom-1 text-white":index===0?"text-slate-400 border-zinc-200":"white"}`} onClick={()=>setCurrentSection(index)}>
                    <div className="flex flex-row">
                      <div className={`border rounded-full ${index===0?(currentSection===index?"border-white":"border-slate-300"):currentSection===index?"border-white":"border-black"}`} 
                        style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>{`${index+1}.`}</div>
                      <div className="m-auto">{section.name}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          <button><ChevronRight className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} /* onClick={nextSection} *//></button>
        </div>

        <div className="mx-10">
          {loadingData?
            React.createElement (formSections[currentSection].component, 
            {
              actionType: actionType,
              loanId: loanId,
              setLoanId: setLoanId,
              AID: AID,
              setAID: setAID,
              currentSection: currentSection,
              setCurrentSection: setCurrentSection,
              goToNextSection: goToNextSection,
              label: (formSections[currentSection].label?formSections[currentSection].label:""),
              setShowSecurityDetails: (formSections[currentSection].name=="Basic Details")?setShowSecurityDetails:"",
              showSecurityDetails: (formSections[currentSection].name=="Security Details")?showSecurityDetails:"",
              setOkToFrolic: currentSection==0?setOkToFrolic:"",
              preexistingValues: actionType=="EDIT"?preexisting:""
            }
          ):""} 
        </div>
      </div> 
    </div>
  )
}

export default CreateLoanAccount;
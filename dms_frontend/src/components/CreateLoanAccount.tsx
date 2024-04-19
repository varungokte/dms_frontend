import React, { useState } from "react";

import ContactDetails from "./LoanAccountComponents/ContactDetails";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import RelationshipMapping from "./LoanAccountComponents/RelationshipMapping";
import BasicDetails from "./LoanAccountComponents/BasicDetails";
import SecurityDetails from "./LoanAccountComponents/SecurityDetails";
import BankDetails from "./LoanAccountComponents/BankDetails";

import { ChevronLeft, ChevronRight } from "lucide-react";

function CreateLoanAccount() {
  const [formSections, setFormSections] = useState([
    { name: "Basic Details", component: BasicDetails },
    { name: "Security Details", component: SecurityDetails},
    { name: "Bank Details", component: BankDetails},
    { name: "Contact Details", component: ContactDetails},
    { name: "Relationship Mapping", component: RelationshipMapping},
    { name: "Transaction Documents", component: LoanDocuments, label: "Transaction Documents"},
    { name: "Compliance Documents", component: LoanDocuments, label: "Compliance Documents"},
    { name: "Ratings", component: Ratings }
  ])
	
  const [currentSection, setCurrentSection] = useState(0);
  const [okToChange, setOkToChange] = useState(false);
  const [submit, setSubmit] = useState(false);

  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2">Create Loan Account</p>
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
        <div className="flex flex-row" style={{position:"relative"}}>
          <button><ChevronLeft className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} /* onClick={previousSection} */ /></button>
            <div style={{ width: '100%', overflowX: 'scroll', whiteSpace: 'nowrap' }}>
              {formSections.map((section:any, index:number)=>{
                return(
                  <button key={index} className={`py-3 px-2 border-2 border-zinc-300 rounded-xl m-3 min-w-44 ${currentSection===index?"bg-custom-1 text-white":"white"}`} onClick={()=>setCurrentSection(index)}>
                    <div className="flex flex-row">
                      <div className={`border rounded-full  ${currentSection===index?"border-white":"border-black"}`} 
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
          {React.createElement (formSections[currentSection].component, {label: (formSections[currentSection].label?formSections[currentSection].label:"")})} 
        </div>

        <br/>

      </div> 
    </div>
  )
}

export default CreateLoanAccount;
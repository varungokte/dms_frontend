import { useState } from "react";

import ContactDetails from "./LoanAccountComponents/Contact Details";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import RelationshipMapping from "./LoanAccountComponents/RelationshipMapping";
import BasicDetails from "./LoanAccountComponents/BasicDetails";
import SecurityDetails from "./LoanAccountComponents/SecurityDetails";
import Address from "./LoanAccountComponents/Address";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BankDetails from "./LoanAccountComponents/BankDetails";

function CreateLoanAccount() {
  const [formNames, setFormNames] = useState([
    "Basic Details", "Security Details", "Borrow Address", "Register Address", "Bank Details", "Contact Details", "Relationship Mapping", "Transaction Documents", "Compliance Documents", "Ratings"
  ]);
  const [formComponents, setFormComponents] = useState([
    <BasicDetails/>, <SecurityDetails/>, <Address label="Borrow" />, <Address label="Register" />, <BankDetails/>, <ContactDetails/>, <RelationshipMapping/>, <LoanDocuments/>, <LoanDocuments/>, <Ratings/>
  ]);
	const [currentSection, setCurrentSection] = useState(0);
  
  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2">Create Loan Account</p>

      <div className="flex flex-row mx-10 mr-2" style={{position:"relative"}}>
        <button><ChevronLeft className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={()=>setCurrentSection(curr=>{if (curr===0)return 0; else return curr-1})} /></button>
          <div style={{display:"inline-block"}}>
            {formNames.map((componentName:any, index:number)=>{
              return(
                <button className={`py-3 px-2 border-2 border-zinc-300 rounded-xl m-3 min-w-44 ${currentSection===index?"bg-custom-1 text-white":"white"}`} onClick={()=>setCurrentSection(index)}>
                  <div className="flex flex-row">
                    <div className={`border rounded-full  ${currentSection===index?"border-white":"border-black"}`} 
                    style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>{`${index+1}.`}</div>
                    <div className="m-auto">{componentName}</div>
                  </div>
                </button>
              )
            })}
          </div>
        <button><ChevronRight  className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={()=>setCurrentSection(curr=>{if (curr===formNames.length-1)return formNames.length-1; else return curr+1})}/></button>
      </div>

      <br/>

      <div className="mx-10">
        {formComponents[currentSection]}
      </div>
    </div>
  )
}

export default CreateLoanAccount;
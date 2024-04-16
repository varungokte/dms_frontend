import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    "Basic Details", "Security Details", "Borrow Address", "Register Address", "Bank Details", "Contact Details", 
    "Relationship Mapping", "Transaction Documents", "Compliance Documents", "Ratings"
  ]);
  
  const [formComponents, setFormComponents] = useState([
    <BasicDetails/>, <SecurityDetails/>, <Address label="Borrow" />, <Address label="Register" />, <BankDetails/>, <ContactDetails/>, 
    <RelationshipMapping/>, <LoanDocuments/>, <LoanDocuments/>, <Ratings/>
  ]);
	
  const [currentSection, setCurrentSection] = useState(0);

	const navigate = useNavigate();

  const previousSection = () =>{
    setCurrentSection(curr=>{
      if (curr===0) return 0 
      else return curr-1
    });
  };

  const nextSection = () => {
    setCurrentSection(curr=>{
      if (curr===formNames.length-1) return formNames.length-1 
      else return curr+1
    });
  }
  
  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2">Create Loan Account</p>
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
        <div className="flex flex-row" style={{position:"relative"}}>
          <button><ChevronLeft className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={previousSection} /></button>
            <div style={{display:"inline-block"}}>
              {formNames.map((componentName:any, index:number)=>{
                return(
                  <button key={index} className={`py-3 px-2 border-2 border-zinc-300 rounded-xl m-3 min-w-44 ${currentSection===index?"bg-custom-1 text-white":"white"}`} onClick={()=>setCurrentSection(index)}>
                    <div className="flex flex-row">
                      <div className={`border rounded-full  ${currentSection===index?"border-white":"border-black"}`} 
                        style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>{`${index+1}.`}</div>
                      <div className="m-auto">{componentName}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          <button><ChevronRight className="text-white bg-custom-1 my-7" style={{borderRadius: "50%"}} onClick={nextSection}/></button>
        </div>

        <div className="mx-10">
          {formComponents[currentSection]}
        </div>

        <br/>

        <div className="flex flex-row">
          <div className="flex-auto">
            <button className="text-red-600 border border-red-600 rounded-xl h-12 w-36 mx-3" onClick={()=>navigate("/loan")}>Cancel</button>
          </div>

          <div>
            <button className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-3" onClick={previousSection}>Previous</button>
            <button className="text-white bg-custom-1 rounded-xl h-12 w-36" onClick={nextSection}>Next</button>
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default CreateLoanAccount;
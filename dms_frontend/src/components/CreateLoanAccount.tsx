import { useState } from "react";

import ContactDetails from "./LoanAccountComponents/Contact Details";
import Ratings from "./LoanAccountComponents/Ratings";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";
import RelationshipMapping from "./LoanAccountComponents/RelationshipMapping";
import BasicDetails from "./LoanAccountComponents/BasicDetails";

function CreateLoanAccount() {
  const [formNames, setFormNames] = useState([
    "Basic Details","Contact Details", "Relationship Mapping", "Transaction Documents", "Compliance Documents", "Ratings"
  ]);
  const [formComponents, setFormComponents] = useState([
    <BasicDetails/>, <ContactDetails/>, <RelationshipMapping/>, <LoanDocuments/>, <LoanDocuments/>, <Ratings/>
  ]);
	const [currentSection, setCurrentSection] = useState(0);
  
  return(
    <div>
			<p className="text-3xl font-bold mx-7 my-2">Create Loan Account</p>

      <div className="flex flex-row flex-wrap mx-10 mr-2">
        <div>{`<`}</div>
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

      <br/>

      <div className="mx-10">
        {formComponents[currentSection]}
      </div>
    </div>
  )
}

export default CreateLoanAccount;
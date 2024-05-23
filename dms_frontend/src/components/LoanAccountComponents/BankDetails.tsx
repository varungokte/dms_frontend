import { FormRepeatableGrid } from "../BasicComponents/FormFields";
import {  useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import { BankAccountType, EnumIteratorValues } from "../BasicComponents/Constants";

function BankDetails(props:any) {
  const {createLoan} = useGlobalContext();

  const [fieldList] = useState([
    { id:"AN", name:"Account Name", type:"text", required:false },
    { id:"BAN", name:"Account Number", type:"text",required:false },
    { id:"AT", name:"Account Type", type:"select", options:EnumIteratorValues(BankAccountType),required:false },
    { id:"IFSC", name:"IFSC", type:"text",required:false },
    { id:"BN", name:"Bank Name", type:"text",required:false},
    { id:"LB", name:"Branch Name", type:"text",required:false },
    { id:"BA", name:"Branch Address", type:"text",required:false },
  ]);
  
  const [fieldValues, setFieldValues] = useState<any>([{}]);
  const [preexistingValues, setPreexistingValues] = useState(false);
  
  useEffect(()=>{
    if (props.preexistingValues["BD"]){
      setFieldValues(props.preexistingValues["BD"]);
      setPreexistingValues(true);
    }
    else 
      setFieldValues([{}])
  },[])
  
  const submitForm = (e:any) =>{
    e.preventDefault();

    let data:any={};
    console.log("bank details field values", fieldValues);

    if (data.length!=0){
      data["AID"] = props.AID;
      data["_loanId"] = props.loanId;
      data["BD"] = fieldValues;
      console.log("SUBMITTED NOW",data);

      createLoan(data).then(res=> {
        console.log("RES", res);
        if (res==200)
          props.goToNextSection(props.setCurrentSection, props.sectionCount);
        else
          console.log("error");
      }
      ).catch(err=> console.log(err))
    }
    else
      props.goToNextSection(props.setCurrentSection, props.sectionCount);
  }

  return (
    <div className="">
      <br/>
      <form onSubmit={submitForm}>
        <FormRepeatableGrid fieldList={fieldList} fieldValues={fieldValues} setFieldValues={setFieldValues} submitForm={submitForm} fieldsInRow={3} preexistingValues={preexistingValues} />
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
    </div>
  )
}
export default BankDetails;
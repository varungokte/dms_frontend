import { useEffect, useState } from "react";
import useGlobalContext from "@/functions/GlobalContext";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { BankAccountTypeList } from "@/functions/Constants";
import { FieldValues,} from "@/types/DataTypes";
import { GridFieldAttributes } from "@/types/FormAttributes";
import { LoanCommonProps } from "@/types/ComponentProps";
import FormRepeatableGrid from "../FormFieldComponents/FormRepeatableGrid";

function LoanBankDetails(props:LoanCommonProps) {
  const {createLoan} = useGlobalContext();

  const fieldList:GridFieldAttributes = {category:"grid", row:4, fields:[
    { id:"AN", name:"Account Name", type:"text", required:false },
    { id:"BAN", name:"Account Number", type:"text",required:false },
    { id:"AT", name:"Account Type", type:"select", options:BankAccountTypeList,required:false },
    { id:"IFSC", name:"IFSC", type:"text",required:false },
    { id:"BN", name:"Bank Name", type:"text",required:false},
    { id:"LB", name:"Branch Name", type:"text",required:false },
    { id:"BA", name:"Branch Address", type:"text",required:false },
  ]};
  
  const [fieldValues, setFieldValues] = useState<any>([{}]);
  const [enableLoadingSign,setEnableLoadingSign] = useState(false); 

  const areAllFieldsEmpty = () => {
    let all_fields_empty=true;
    for (let i=0; i<fieldList["fields"].length; i++){
      const field = fieldList["fields"][i];
      for (let j=0; j<fieldValues.length; j++){
        const singleAccount=fieldValues[j];
        if (singleAccount[field.id] && singleAccount[field.id]!="" && singleAccount[field.id]!=-1)
          all_fields_empty=false;
      }
    }
    return all_fields_empty;
  }
  
  const valuesHaveBeenEdited = () => {
    if (!props.preexistingValues || !props.preexistingValues["BD"] || fieldValues.length!=props.preexistingValues["BD"].length)
      return true;
    
    let changes_have_been_made=false;
    for (let i=0; i<fieldList["fields"].length; i++){
      const field = fieldList["fields"][i];
      for (let j=0; j<fieldValues.length; j++){
        let preexisingValue = undefined;
        let newValue = undefined;
        
        if (fieldValues[j] && fieldValues[j][field.id])
          newValue=fieldValues[j][field.id]
        if (props.preexistingValues["BD"][j] && props.preexistingValues["BD"][j][field.id])
          preexisingValue=props.preexistingValues["BD"][j][field.id];

        if (preexisingValue!=newValue)
          changes_have_been_made=true;
      }
    }
    return changes_have_been_made;
  }
    
  useEffect(()=>{
    if (props.preexistingValues["BD"] && props.preexistingValues["BD"].length!=0)
      setFieldValues([...props.preexistingValues["BD"]]);
    else 
      setFieldValues([{}]);
  },[]);

  useEffect(()=>{
    if (props.preexistingValues && props.preexistingValues["BD"] && Object.keys(props.preexistingValues["BD"]).length!=0)
      props.setUnsavedWarning(valuesHaveBeenEdited());
    else
      props.setUnsavedWarning(!areAllFieldsEmpty());
  },[fieldValues]);
  
  const submitForm = async (e:any) =>{
    e.preventDefault();

    //console.log("fieldValues",fieldValues)
    if (!valuesHaveBeenEdited()){
      props.goToNextSection();
      return;
    }

    const data:FieldValues = {}
    data["AID"] = props.AID;
    data["_loanId"] = props.loanId;
    data["BD"] = fieldValues;
    //console.log("SUBMITTED NOW",data);

    setEnableLoadingSign(true)
    const res = await createLoan(data);
    if (res==200)
      props.goToNextSection({changesHaveBeenMade:true});
    else
      setEnableLoadingSign(false)
  }

  return (
    <div className="">
      <br/>
      <form onSubmit={submitForm} >
        <FormRepeatableGrid fieldList={fieldList["fields"]} fieldValues={fieldValues} setFieldValues={setFieldValues} submitForm={submitForm} fieldsInRow={3} disabled={props.actionType=="VIEW"} readonly={props.actionType=="VIEW"} />
        <FormSectionNavigation currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} isForm enableLoadingSign={enableLoadingSign} actionType={props.actionType} />
      </form>
    </div>
  )
}
export default LoanBankDetails;

import { useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { BankAccountTypeList } from "../../../Constants";
import { FieldValues, GridFieldAttributes, LoanCommonProps } from "DataTypes";
import FormRepeatableGrid from "../FormFieldComponents/FormRepeatableGrid";

function LoanBankDetails(props:LoanCommonProps) {
  const {createLoan} = useGlobalContext();

  const [fieldList] = useState<GridFieldAttributes>({
    category:"grid", row:4, fields:[
      { id:"AN", name:"Account Name", type:"text", required:false },
      { id:"BAN", name:"Account Number", type:"text",required:false },
      { id:"AT", name:"Account Type", type:"select", options:BankAccountTypeList,required:false },
      { id:"IFSC", name:"IFSC", type:"text",required:false },
      { id:"BN", name:"Bank Name", type:"text",required:false},
      { id:"LB", name:"Branch Name", type:"text",required:false },
      { id:"BA", name:"Branch Address", type:"text",required:false },
    ]
  });
  
  const [fieldValues, setFieldValues] = useState<any>([{}]);
  const [valuesExist, setValuesExist] = useState(false);

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
    return all_fields_empty
  }
  
  const compareFieldsToPreexisting = () => {
    let changes_have_been_made=false;
    for (let i=0; i<fieldList["fields"].length; i++){
      const field = fieldList["fields"][i];
      for (let j=0; j<fieldValues.length; j++)
        if (fieldValues[j][field.id] &&  props.preexistingValues["BD"] && fieldValues[j][field.id]!=props.preexistingValues["BD"][j][field.id])
        changes_have_been_made=true;
    }
    console.log("changes have been made",changes_have_been_made);
    return changes_have_been_made;
  }

  useEffect(()=>{
  },[props.preexistingValues])
    
  useEffect(()=>{
    if (props.preexistingValues["BD"]){
      const arr:any=[];
      props.preexistingValues["BD"].map((element:any)=>{
        const obj:any={};
        Object.keys(element).map(value=>{
          obj[value] = element[value];
        })
        arr.push(obj);
      });
      setFieldValues(arr);

      setValuesExist(true);
      props.setUnsavedWarning(true);
    }
    else 
      setFieldValues([{}])
  },[]);

  useEffect(()=>{
    if (Object.keys(props.preexistingValues).length!=0)
      props.setUnsavedWarning(compareFieldsToPreexisting());
    else
      props.setUnsavedWarning(!areAllFieldsEmpty());
  },[fieldValues]);
  
  const submitForm = async (e:any) =>{
    e.preventDefault();

    if (!compareFieldsToPreexisting()){
      props.goToNextSection();
      return;
    }

    const data:FieldValues = {}
    data["AID"] = props.AID;
    data["_loanId"] = props.loanId;
    data["BD"] = fieldValues;
    console.log("SUBMITTED NOW",data);

    const res = await createLoan(data);
    if (res==200){
      console.log("response",res)
      props.goToNextSection();
      props.setChangesHaveBeenMade(true);
    }
  }

  return (
    <div className="">
      <br/>
      <form onSubmit={submitForm}>
        <FormRepeatableGrid fieldList={fieldList["fields"]} fieldValues={fieldValues} setFieldValues={setFieldValues} submitForm={submitForm} fieldsInRow={3} preexistingValues={valuesExist} />
        <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
    </div>
  )
}
export default LoanBankDetails;
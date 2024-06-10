import { FormRepeatableGrid } from "../FormComponents/FormFields";
import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import { BankAccountType, EnumIteratorValues } from "../BasicComponents/Constants";

function BankDetails(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}) {
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
  const [valuesExist, setValuesExist] = useState(false);

  const areAllFieldsEmpty = () => {
    let all_fields_empty=true;
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      for (let j=0; j<fieldValues.length; j++){
        const singleAccount=fieldValues[j];
        if (singleAccount[field.id] && singleAccount[field.id]!="" && singleAccount[field.id]!=-1)
          all_fields_empty=false;
      }
    }
    return all_fields_empty
  }
  
  const compareFieldsToPreexisting = () => {
    let no_changes=true;
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      for (let j=0; j<fieldValues.length; j++){
        if (fieldValues[j][field.id] && fieldValues[j][field.id]!=props.preexistingValues["BD"][j][field.id])
          no_changes=false;
      }
    }
    return no_changes;
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
      props.setOkToChange(true);
    }
    else 
      setFieldValues([{}])
  },[]);

  useEffect(()=>{
    if (props.actionType=="EDIT" && props.preexistingValues)
      props.setOkToChange(compareFieldsToPreexisting());
    else
      props.setOkToChange(areAllFieldsEmpty());
  },[fieldValues]);
  
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
          props.goToNextSection();
        else
          console.log("error");
      }
      ).catch(err=> console.log(err))
    }
    else
      props.goToNextSection();
  }

  return (
    <div className="">
      <br/>
      <form onSubmit={submitForm}>
        <FormRepeatableGrid fieldList={fieldList} fieldValues={fieldValues} setFieldValues={setFieldValues} submitForm={submitForm} fieldsInRow={3} preexistingValues={valuesExist} />
        <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
    </div>
  )
}
export default BankDetails;
import { useContext, useEffect, useState } from "react";
import { LoanCommonProps } from "@/types/ComponentProps";
import { GridFieldAttributes } from "@/types/FormAttributes";
import { createLoan } from "@/apiFunctions/loanAPIs";
import { MasterValuesContext } from "@/Contexts";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import DateField from "../FormFieldComponents/DateField";
import FormRepeatableGrid from "../FormComponents/FormRepeatableGrid";
import FloatNumberField from "../FormFieldComponents/FloatNumberField";

function LoanSecurityDetails(props:LoanCommonProps){
  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { LoanSecurityTypeList } = masters;

  const [fieldValuesFixed, setFieldValuesFixed] = useState<any>({});
  const [fieldValuesRepeatable, setFieldValuesRepeatable] = useState<any>([{}]);
  const [enableLoadingSign,setEnableLoadingSign] = useState(false); 
  
  const fieldListFixed:GridFieldAttributes = {category:"grid",row:2,fields:[
    { id:"SP", name:"Share Percentage(%)", type:"float", required:false },
    { id:"DV", name:"Date of Valuation", type:"date",required:false },
  ]};
  const fieldListRepeatable:GridFieldAttributes = {category:"grid",row:2,fields:[
    { id:"T", name:"Security Type", type:"select", options:LoanSecurityTypeList,required:false },
    { id:"V", name:"Security Value", type:"integer",required:false },
  ]};

  //useEffect(()=>console.log("fieldvalues repeatable",fieldValuesRepeatable),[fieldValuesRepeatable])
  
  const [disableFields, setDisableFields] = useState(false);

  const areAllFieldsEmpty = () => {
    let all_fields_empty=true;

    for (let i=0; i<fieldListFixed.fields.length; i++){
      const id=fieldListFixed.fields[i].id;
      if (fieldValuesFixed[id] && fieldValuesFixed[id]!="")  
        all_fields_empty=false;
    }

    for (let i=0; i<fieldListRepeatable.fields.length; i++){
      const id=fieldListRepeatable.fields[i].id;
      for (let j=0; j<fieldValuesRepeatable.length; j++){
        if (fieldValuesRepeatable[j][id] && fieldValuesRepeatable[j][id]!="")
          all_fields_empty = false;
      }
    }
    return all_fields_empty;
  }

  const valuesHaveBeenEdited = () => {
    let changes_have_been_made = false;

    for (let i=0; i<fieldListFixed.fields.length; i++){
      const id = fieldListFixed.fields[i].id;
      if (props.preexistingValues[id]!=fieldValuesFixed[id])
        changes_have_been_made= true;
    }

    for (let i=0; i<fieldListRepeatable.fields.length; i++){
      const id = fieldListFixed.fields[i].id;
      for (let j=0; j<fieldValuesRepeatable.length; j++){
        let preexisingValue=undefined;
        let newValue=undefined;
        if (props.preexistingValues["STV"] && props.preexistingValues["STV"][j])
          preexisingValue=props.preexistingValues["STV"][j][id];
        if (fieldValuesRepeatable[j])
          newValue=fieldValuesRepeatable[j][id];

        if (newValue!=preexisingValue)
          changes_have_been_made= true;
      }
    }
    return changes_have_been_made;
  }
  
  useEffect(()=>{
    if (!props.showSecurityDetails){
      setDisableFields(true);
      return;
    }

    const obj:any={};
    if (props.preexistingValues["SP"])
      obj["SP"] = props.preexistingValues["SP"];
    
    if (props.preexistingValues["DV"])
      obj["DV"] = props.preexistingValues["DV"];
    
    if (Object.keys(obj).length!=0){
      setFieldValuesFixed(obj);
    }
    
    if (props.preexistingValues["STV"] && props.preexistingValues["STV"].length!=0)  
      setFieldValuesRepeatable([...props.preexistingValues["STV"]]);
    else 
      setFieldValuesRepeatable([{}]);

  },[]);

  useEffect(()=>{
    let okToChange = areAllFieldsEmpty();
    if (Object.keys(props.preexistingValues).length!=0)
      okToChange = okToChange || !valuesHaveBeenEdited();
    props.setUnsavedWarning(!okToChange);
  },[fieldValuesFixed,fieldValuesRepeatable]);

  const submitForm = async(e:any) => {
    e.preventDefault();
    let data:any={};

    if (Object.keys(fieldValuesFixed).length!=0 || fieldValuesRepeatable.length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;
      data["SP"] = fieldValuesFixed["SP"];
      data["DV"] = fieldValuesFixed["DV"];
      data["STV"] = [];
      for (let i=0; i<fieldValuesRepeatable.length; i++)
        if (Object.keys(fieldValuesRepeatable[i]).length!=0)
          data["STV"].push(fieldValuesRepeatable[i]);

      setEnableLoadingSign(true);
      const res = await createLoan(data)
      if (res==200)
        props.goToNextSection({changesHaveBeenMade:true});
      else
        console.log("ERROR")
    }
    else
      props.goToNextSection(); 
  }

  return(
    <div className="">
      <br/>
      {disableFields
        ?<div>
          <p className="text-red-600 m-5">These fields are not applicable because the security type was marked unsecured in the previous section.<br/>Please move on to the next section</p>
          <FormSectionNavigation currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} isForm={false} enableLoadingSign={enableLoadingSign} actionType={props.actionType} />
          </div>
        :<form onSubmit={submitForm}>
          <div className="grid grid-cols-2">
            {fieldListFixed.fields.map((field,index)=>{
              if (field.type=="date")
                return <DateField key={index} index={index} fieldData={field} fieldValue={fieldValuesFixed[field.id]} setFieldValues={setFieldValuesFixed} disabled={props.actionType=="VIEW"||disableFields} readonly={props.actionType=="VIEW"} repeatFields={false} formIndex={-1}/>
              else if (field.type=="float")
                return <FloatNumberField key={index} index={index} fieldData={field} fieldValue={fieldValuesFixed[field.id]} setFieldValues={setFieldValuesFixed} disabled={props.actionType=="VIEW"||disableFields} readonly={props.actionType=="VIEW"} repeatFields={false} formIndex={-1}/>
            })}
          </div>
          <FormRepeatableGrid key={2} fieldList={fieldListRepeatable.fields} fieldValues={fieldValuesRepeatable} setFieldValues={setFieldValuesRepeatable} submitForm={submitForm} fieldsInRow={2} disabled={props.actionType=="VIEW"} readonly={props.actionType=="VIEW"} />
          <FormSectionNavigation currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} isForm enableLoadingSign={enableLoadingSign} actionType={props.actionType} />
          <br/>
        </form>
      }
    </div>
  )
}

export default LoanSecurityDetails;
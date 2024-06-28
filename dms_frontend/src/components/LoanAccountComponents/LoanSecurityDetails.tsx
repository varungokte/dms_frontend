import { useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { LoanSecurityTypeList } from "../../../Constants";
import { LoanCommonProps } from "../../../DataTypes";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import DateField from "../FormFieldComponents/DateField";
import NumberField from "../FormFieldComponents/NumberField";
import FormRepeatableGrid from "../FormFieldComponents/FormRepeatableGrid";

function LoanSecurityDetails(props:LoanCommonProps){
  const [fieldValuesFixed, setFieldValuesFixed] = useState<any>({});
  const [fieldValuesRepeatable, setFieldValuesRepeatable] = useState<any>([{}]);

  const [fieldList] = useState([
    { id:"SP", name:"Share Percentage(%)", type:"number", required:false },
    { id:"DV", name:"Date of Valuation", type:"date",required:false },
    { id:"STV", name:"", type:"repeatable", fields:[
      { id:"T", name:"Security Type", type:"select", options:LoanSecurityTypeList,required:false },
      { id:"V", name:"Security Value", type:"number",required:false },
    ]}
  ]);
  
  const {createLoan} = useGlobalContext();
  
  const [disableFields, setDisableFields] = useState(false);
  const [preexistingValues, setPreexistingValues] = useState(false);

  const areAllFieldsEmpty = () => {
    let all_fields_empty=true;
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (fieldValuesFixed[field.id] && fieldValuesFixed[field.id]!="" && fieldValuesFixed[field.id]!=-1)
        all_fields_empty = false;
      if (field.id=="STV"){
        for (let j=0; j<fieldValuesRepeatable.length; j++){
          if (fieldValuesRepeatable[j]["T"] && fieldValuesRepeatable[j]["T"]!="" && fieldValuesRepeatable[j]["T"]!=-1)
            all_fields_empty = false;
          if (fieldValuesRepeatable[j]["V"] && fieldValuesRepeatable[j]["V"]!="" && fieldValuesRepeatable[j]["V"]!=-1)
            all_fields_empty = false;
        }
      }
    }
    return all_fields_empty;
  }

  const compareFieldsToPreexisting = () => {
    let changes_have_been_made = false;
    for (let i=0; i<fieldList.length; i++){
      const id = fieldList[i].id;
      if (fieldValuesFixed[id] && props.preexistingValues[id]!=fieldValuesFixed[id])
        changes_have_been_made= true;
      if (id=="STV"){
        for (let j=0; j<fieldValuesRepeatable.length; j++){
          if (fieldValuesRepeatable[j]["T"] && props.preexistingValues["STV"] && fieldValuesRepeatable[j]["T"]!=props.preexistingValues["STV"][j]["T"])
            changes_have_been_made= true;
          if (fieldValuesRepeatable[j]["V"] && props.preexistingValues["STV"] && fieldValuesRepeatable[j]["V"]!=props.preexistingValues["STV"][j]["V"])
            changes_have_been_made= true;
        }
      }
    }
    return changes_have_been_made;
  }
  
  useEffect(()=>{
    if (!props.showSecurityDetails)
      setDisableFields(true)

    const obj:any={};

    if (props.preexistingValues["SP"])
      obj["SP"] = props.preexistingValues["SP"];
    
    if (props.preexistingValues["DV"])
      obj["DV"] = props.preexistingValues["DV"];
    
    if (Object.keys(obj).length!=0){
      setFieldValuesFixed(obj);
      setPreexistingValues(true);
    }
    
    if (props.preexistingValues["STV"]){
      const arr:any=[];
      props.preexistingValues["STV"].map((element:any)=>{
        const temp:any={};
        Object.keys(element).map(value=>{
          temp[value] = element[value]
        })
        arr.push(temp);
      })
      setFieldValuesRepeatable(arr);
      setPreexistingValues(true);
    }
    else 
      setFieldValuesRepeatable([{}]);
  },[]);

  useEffect(()=>{
    console.log("changed field values",fieldValuesRepeatable)
    let okToChange = areAllFieldsEmpty();
    if (Object.keys(props.preexistingValues).length!=0)
      okToChange = okToChange || !compareFieldsToPreexisting();
    props.setUnsavedWarning(!okToChange);
  },[fieldValuesFixed,fieldValuesRepeatable]);

  const submitForm = (e:any) => {
    e.preventDefault();
    let data:any={};

    if (Object.keys(fieldValuesFixed).length!=0 || fieldValuesRepeatable.length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;
      data["SP"] = fieldValuesFixed["SP"];
      data["DV"] = fieldValuesFixed["DV"];
      data["STV"] = fieldValuesRepeatable;

      createLoan(data).then(res=> {
        console.log("RES", res);
        if (res==200){
          props.goToNextSection();
          props.setChangesHaveBeenMade(true);
        }
        else
          console.log("ERROR")
      }
      ).catch(err=> console.log(err))
    }
    else
      props.goToNextSection(); 
  }

  return(
    <div className="">
      <br/>
      {disableFields?<p className="text-red-600 m-5">These fields are not applicable because the security type was marked unsecured in the previous section.<br/>Please move on to the next section</p>:""}
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-2">
          {fieldList.map((field,index)=>{
            if (field.type=="date" && !disableFields)
              return <DateField key={index} index={index} id={field.id} name={field.name} prefillValues={fieldValuesFixed} setPrefillValues={setFieldValuesFixed} disabled={disableFields} required={field.required||false} repeatFields={false} formIndex={-1}/>
            else if (field.type=="number" && !disableFields)
              return <NumberField key={index} index={index} id={field.id} name={field.name} prefillValues={fieldValuesFixed} setPrefillValues={setFieldValuesFixed} disabled={disableFields} required={field.required||false} repeatFields={false} formIndex={-1}/>
          })}
          </div>

          {fieldList.map((field,index)=>{
            if (field.type=="repeatable" && !disableFields)
              return <FormRepeatableGrid key={index} fieldList={field.fields||[]} fieldValues={fieldValuesRepeatable} setFieldValues={setFieldValuesRepeatable} submitForm={submitForm} fieldsInRow={2} preexistingValues={preexistingValues} />
          })}
        <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      <br/>
      </form>
    </div>
  )
}

export default LoanSecurityDetails;
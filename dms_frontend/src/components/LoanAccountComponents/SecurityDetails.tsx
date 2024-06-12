import { useEffect, useState } from "react";
import { FormRepeatableGrid, NumberField, DateField } from "../FormComponents/FormFields";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import useGlobalContext from "./../../../GlobalContext";

function SecurityDetails(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setUnsavedWarning: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any}){
  const [fieldValuesFixed, setFieldValuesFixed] = useState<any>({});
  const [fieldValuesRepeatable, setFieldValuesRepeatable] = useState<any>([{}]);

  const [fieldList] = useState([
    { id:"S", name:"Share Percentage(%)", type:"number", required:false },
    { id:"DV", name:"Date of Valuation", type:"date",required:false },
    { id:"STV", name:"", type:"repeatable", fields:[
      { id:"T", name:"Security Type", type:"select", options:[1,2],required:false },
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
    let no_changes = true;
    for (let i=0; i<fieldList.length; i++){
      const id = fieldList[i].id;
      if (fieldValuesFixed[id] && props.preexistingValues[id]!=fieldValuesFixed[id])
        no_changes= false;
      if (id=="STV"){
        for (let j=0; j<fieldValuesRepeatable.length; j++){
          if (fieldValuesRepeatable[j]["T"] && fieldValuesRepeatable[j]["T"]!=props.preexistingValues[id])
          no_changes = false;
          if (fieldValuesRepeatable[j]["V"] && fieldValuesRepeatable[j]["V"]!=props.preexistingValues[id])
          no_changes = false;
        }
      }
    }
    return no_changes;
  }
  
  useEffect(()=>{
    if (!props.showSecurityDetails)
      setDisableFields(true)

    const obj:any={};

    if (props.preexistingValues["S"])
      obj["S"] = props.preexistingValues["S"];
    
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
    let okToChange = areAllFieldsEmpty();
    if (props.actionType=="EDIT" && Object.keys(props.preexistingValues).length!=0)
      okToChange = okToChange && compareFieldsToPreexisting();
    props.setUnsavedWarning(!okToChange);
  },[fieldValuesFixed,fieldValuesRepeatable]);

  const submitForm = (e:any) => {
    e.preventDefault();
    let data:any={};

    if (Object.keys(fieldValuesFixed).length!=0 || fieldValuesRepeatable.length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;
      data["S"] = fieldValuesFixed["S"];
      data["STV"] = fieldValuesRepeatable;

      console.log("SUBMITTED NOW",data);
      createLoan(data).then(res=> {
        console.log("RES", res);
        if (res==200)
          props.goToNextSection();
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
              return <FormRepeatableGrid key={index} fieldList={field.fields} fieldValues={fieldValuesRepeatable} setFieldValues={setFieldValuesRepeatable} submitForm={submitForm} fieldsInRow={2} preexistingValues={preexistingValues} />
          })}
        <FormSectionNavigation currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      <br/>
      </form>
    </div>
  )
}

export default SecurityDetails;
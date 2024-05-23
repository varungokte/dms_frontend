import { useEffect, useState } from "react";
import { FormTextField, FormRepeatableGrid } from "../BasicComponents/FormFields";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import useGlobalContext from "./../../../GlobalContext";

function SecurityDetails(props:any){
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
  
  useEffect(()=>{
    if (!props.showSecurityDetails)
      setDisableFields(true)

    if (props.preexistingValues["some data here"]){
      //setFieldValues(props.preexistingValues["BD"]);
      setPreexistingValues(true);
    }
    else 
      setFieldValuesRepeatable([{}]);
  },[]);

  const submitForm = (e:any) => {
    e.preventDefault();
    let data:any={};

    console.log("security details field values", fieldValuesRepeatable);

    if (Object.keys(fieldValuesFixed).length!=0 || fieldValuesRepeatable.length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;
      data["S"] = fieldValuesFixed["S"];
      data["STV"] = fieldValuesRepeatable;

      console.log("SUBMITTED NOW",data);
      createLoan(data).then(res=> {
        console.log("RES", res);
        if (res==200)
          props.goToNextSection(props.setCurrentSection, props.sectionCount);
        else
          console.log("ERROR")
      }
      ).catch(err=> console.log(err))
    }
    else
      props.goToNextSection(props.setCurrentSection, props.sectionCount); 
  }

  return(
    <div className="">
      <br/>
      {disableFields?<p className="text-red-600">These fields are not applicable because the security type was marked unsecured in the previous section.<br/>Please move on to the next section</p>:""}
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-2">
          {fieldList.map((field,index)=>{
            if (field.type!="repeatable")
              return <FormTextField key={index} id={field.id} name={field.name} fieldValues={fieldValuesFixed} setter={setFieldValuesFixed} type={field.type} disabled={disableFields} required={field.required||false} repeatFields={false} formIndex={-1}/>
          })}
          </div>

          {fieldList.map((field,index)=>{
            if (field.type=="repeatable")
              return <FormRepeatableGrid key={index} fieldList={field.fields} fieldValues={fieldValuesRepeatable} setFieldValues={setFieldValuesRepeatable} submitForm={submitForm} fieldsInRow={2} preexistingValues={preexistingValues} />
          })}
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      <br/>
      </form>
    </div>
  )
}

export default SecurityDetails;
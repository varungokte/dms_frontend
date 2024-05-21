
import { useEffect, useState } from "react";
import { FormTextField, FormRepeatableGrid } from "../BasicComponents/FormFields";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import useGlobalContext from "./../../../GlobalContext";

function SecurityDetails(props:any){
  const [fieldValues, setFieldValues] = useState({});
  const [disableFields, setDisableFields] = useState(false);

  const {createLoan} = useGlobalContext();

  useEffect(()=>{
    if (!props.showSecurityDetails)
      setDisableFields(true)
  },[]);

  useEffect(()=>{
    console.log("kal-el", fieldValues);
  },[fieldValues])

  const [fieldList] = useState([
    { id:"S", name:"Share Percentage(%)", type:"number", required:false },
    { id:"DV", name:"Date of Valuation", type:"date",required:false },
    { id:"STV", name:"", type:"repeatable", fields:[
      { id:"T", name:"Security Type", type:"select", options:[1,2],required:false },
      { id:"V", name:"Security Value", type:"number",required:false },
    ]}
  ]);

  const submitForm = (e:any) => {
    e.preventDefault();
    let data:any={};

    const securityList:any = [];

    Object.keys(fieldValues).map(field=>{
      //@ts-ignore
      if (fieldValues[field]==null || fieldValues[field]==-1)
        return;
      if (!isNaN(Number(field.charAt(1))) && field.charAt(0)=="T")
        //@ts-ignore
        securityList.push({T: fieldValues[field], V:fieldValues["V"+field.charAt(1)]});
      else if (field=="DV" || field=="S")
        //@ts-ignore
        data[field] = fieldValues[field];
    })

    console.log("list of securities", securityList)

    if (Object.keys(data).length!=0){
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;
      data["STV"] = securityList
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
            if (field.type=="repeatable")
              return <FormRepeatableGrid key={index} grid={field.fields} setter={setFieldValues} fieldValues={{...fieldValues}} />
            else
              return <FormTextField key={index} id={field.id} name={field.name} fieldValues={fieldValues} setter={setFieldValues} type={field.type} disabled={disableFields} required={field.required||false} />
          })}
        </div>
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      <br/>
      </form>
    </div>
  )
}

export default SecurityDetails;
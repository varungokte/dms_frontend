import { FormTextField, FormSelectField } from "../BasicComponents/FormFields";
import { useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormSectionNavigation, goToNextSection } from "../BasicComponents/FormSectionNavigation";

function BankDetails(props:any) {
  const {createLoan} = useGlobalContext();

  const [firstRow, setFirstRow] = useState([
    { id:"AN", name:"Account Name", type:"text" },
    { id:"BAN", name:"Account Number", type:"text" },
  ]);
  
  const [secondRow, setSecondRow] = useState([
    { id:"AT", name:"Account Type", type:"select", options:["op1","op2"] },
    { id:"IFSC", name:"IFSC", type:"text" },
    { id:"BN", name:"Bank Name", type:"text"},
  ]);
  const [thirdRow, setThirdRow] = useState([
    { id:"LB", name:"Branch Name", type:"text" },
    { id:"BA", name:"Branch Address", type:"text" },
  ]);

  const [fieldValues, setFieldValues] = useState({
    "AN": null, "BAN": null, 
    "AT": null, "IFSC": null, "BN": null,
    "LB": null, "BA": null
  })

  const submitForm = (e:any) =>{
    e.preventDefault();

    let data:any={};

    Object.keys(fieldValues).map(field=>{
      //@ts-ignore
      if (fieldValues[field]==null || fieldValues[field]==-1)
        return;
      //@ts-ignore
      data[field] = fieldValues[field];
    });

    if (Object.keys(data).length!=0){
      console.log("SUBMITTED NOW",data);
      /* createLoan(data).then(res=> {
        console.log("RES", res);
        goToNextSection(props.setCurrentSection, props.sectionCount);
      }
      ).catch(err=> console.log(err)) */
    }
    else
      goToNextSection(props.setCurrentSection, props.sectionCount);
  }

  return (
    <div className="">
      <br/>
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-2">
          {firstRow.map(field=>{
            return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} type={field.type} />
          })}
        </div>

        <div className="grid grid-cols-3">
          {secondRow.map(field=>{
            if (field.type=="select")
              return <FormSelectField key={field.id} id={field.id} name={field.name} setter={setFieldValues} optionsList={field.options} />
            else
              return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} type={field.type} />
          })}
        </div>

        <div className="grid grid-cols-2">
          {thirdRow.map(field=>{
            return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} type={field.type} />
          })}
        </div>
        <br/>
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} isForm={true} />
      </form>
    </div>
  )
}
export default BankDetails;
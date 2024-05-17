import { FormTextField, FormSelectField } from "../BasicComponents/FormFields";
import { useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";

function BankDetails(props:any) {
  const {createLoan} = useGlobalContext();

  const [firstRow] = useState([
    { id:"AN", name:"Account Name", type:"text", required:false },
    { id:"BAN", name:"Account Number", type:"text",required:false },
  ]);
  
  const [secondRow] = useState([
    { id:"AT", name:"Account Type", type:"select", options:["op1","op2"],required:false },
    { id:"IFSC", name:"IFSC", type:"text",required:false },
    { id:"BN", name:"Bank Name", type:"text",required:false},
  ]);
  const [thirdRow] = useState([
    { id:"LB", name:"Branch Name", type:"text",required:false },
    { id:"BA", name:"Branch Address", type:"text",required:false },
  ]);

  const [fieldValues, setFieldValues] = useState({
    "AN": "", "BAN": "", 
    "AT": "", "IFSC": "", "BN": "",
    "LB": "", "BA": ""
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
      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      console.log("SUBMITTED NOW",data);
      createLoan(data).then(res=> {
        console.log("RES", res);
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
        <div className="grid grid-cols-2">
          {firstRow.map(field=>{
            return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} required={field.required} disabled={false} type={field.type} value={/* @ts-ignore */
            fieldValues[field.id]} />
          })}
        </div>

        <div className="grid grid-cols-3">
          {secondRow.map(field=>{
            if (field.type=="select")
              return <FormSelectField key={field.id} id={field.id} name={field.name} setter={setFieldValues} required={field.required} disabled={false} options={field.options} value={/* @ts-ignore */
              fieldValues[field.id]} />
            else
              return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} required={field.required} disabled={false} type={field.type} value={/* @ts-ignore */
              fieldValues[field.id]} />
          })}
        </div>

        <div className="grid grid-cols-2">
          {thirdRow.map(field=>{
            return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} required={field.required} disabled={false} type={field.type} value={/* @ts-ignore */
            fieldValues[field.id]} />
          })}
        </div>
        <br/>
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
    </div>
  )
}
export default BankDetails;
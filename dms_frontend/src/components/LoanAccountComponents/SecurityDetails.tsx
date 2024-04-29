
import { useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { FormTextField, FormSelectField } from "../BasicComponents/FormFields";
import { FormSectionNavigation, goToNextSection } from "../BasicComponents/FormSectionNavigation";

function SecurityDetails(props:any){
  const [fieldValues, setFieldValues] = useState({
    "S": null, "DV": null, "T": null, "V": null
  });

  const [disableFields, setDisableFields] = useState(false);

  useEffect(()=>{
    if (!props.showSecurityDetails)
      setDisableFields(true)
  },[])

  const [fieldList, setFieldList] = useState([
    { id:"S", name:"Share Percentage(%)", type:"number" },
    { id:"DV", name:"Date of Valuation", type:"date" },
    { unnecessaryComplication: true, id:"T", name:"Security Type", type:"select", options:["op1","op2"] },
    { unnecessaryComplication: true, id:"V", name:"Security Value", type:"text" }
  ])

  const {createLoan} = useGlobalContext();

  const submitForm = (e:any) => {
    e.preventDefault();
    let data:any={};

    Object.keys(fieldValues).map(field=>{
      //@ts-ignore
      if (fieldValues[field]==null || fieldValues[field]==-1)
        return;
      //@ts-ignore
      data[field] = fieldValues[field];
    })

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

  return(
    <div className="">
      <br/>
      {disableFields?<p className="text-red-600">These fields are not applicable because the security type was marked unsecured in the previous section.<br/>Please move on to the next section</p>:""}
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-2">
          {fieldList.map(field=>{
            if (field.type=="select")
              return <FormSelectField key={field.id} id={field.id} name={field.name} setter={setFieldValues} optionsList={field.options} disabled={disableFields} />
            else 
              return <FormTextField key={field.id} id={field.id} name={field.name} setter={setFieldValues} type={field.type} disabled={disableFields}  />
          })}
        </div>
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} isForm={true} />
      </form>
    </div>
  )
}

export default SecurityDetails;
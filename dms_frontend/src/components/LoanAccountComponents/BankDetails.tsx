import { RenderForm } from "../BasicComponents/FormFields";
import { createElement, useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import { BankAccountType, EnumIteratorValues } from "../BasicComponents/Constants";

function BankDetails(props:any) {
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

  const [fieldValues, setFieldValues] = useState<any>({});
  const [currentForm, setCurrentForm] = useState(0);
  const [repeatForm, setRepeatForm] = useState<any>([{ key:"f0", grid:fieldList, fieldValues:fieldValues, setter: setFieldValues, formIndex:currentForm }]);
  const [renderRepeatForm, setRenderRepeatForm] = useState<any>([createElement(RenderForm, repeatForm[0])]);
  const accountList:any = [];
  
  useEffect(()=>{
    setRenderRepeatForm((curr:any)=>{
      curr = repeatForm.map((form:any)=>{
        form.fieldValues = fieldValues;
        return createElement(RenderForm, form);
      });
      return curr;
    })
  },[fieldValues,repeatForm]);

  const submitForm = (e:any) =>{
    e.preventDefault();

    let data:any={};
    console.log("bank details field values", fieldValues)

    const accounts = Object.keys(fieldValues).filter((field)=>field.charAt(0)=="A"&&field.charAt(1)=="N")
    console.log("acconts", accounts)
    for (let i=1; i<=accounts.length; i++){
      const obj:any= {};
      fieldList.map(field=>{
        obj[field.id] = fieldValues[field.id+i];
      })
      accountList.push(obj)
    }

    if (accountList.length!=0){
      data["AID"] = props.AID;
      data["_loanId"] = props.loanId;
      data["BD"] = accountList
      console.log("SUBMITTED NOW",data);
      createLoan(data).then(res=> {
        console.log("RES", res);
        if (res==200)
          props.goToNextSection(props.setCurrentSection, props.sectionCount);
        else
          console.log("error");

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
        <div>
         {renderRepeatForm.map((grid:any,index:number)=>{
            return <div key={index} className="grid grid-cols-3">{grid}</div>;
          })}
        </div>
          <div>
            {repeatForm.length>1 
              ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button" 
                  onClick={()=>{
                    setCurrentForm(curr=>{return curr-1}); 
                    setRepeatForm((curr:any)=>{return curr.slice(0,-1);})
                  }}
                >-</button>
              :""
            }
            <button className="mt-10 h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button"
              onClick={()=>{
                setCurrentForm(curr=> {return curr+1});
                setRepeatForm((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:fieldList, fieldValues:{...fieldValues}, setter:setFieldValues, formIndex:currentForm+1 }]}); 
              }}
            >+</button>
          </div>
        <br/>
        <FormSectionNavigation setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
    </div>
  )
}
export default BankDetails;
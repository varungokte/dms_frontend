import { useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import FormSectionNavigation from "../BasicComponents/FormSectionNavigation";

function BasicDetails(props:any) {
  const [agmtId, setAgmtId] = useState("");
  const [zone,setZone] = useState(-1);
  const [comName, setComName] = useState("");
  const [panNum, setPanNum] = useState("");
  const [groupName, setGroupName] = useState("");
  const [gstNum, setgstNum] = useState("");
  const [cinNum, setCinNum] = useState("");
  const [industry, setIndutry] = useState(-1);
  const [sanctionAmount, setSanctionAmount] = useState(-1);
  const [holdAmount, setHoldAmount] = useState(-1);
  const [downsellAmount, setDownsellAmount] = useState(-1);
  const [downsellDate, setDownsellDate] = useState<Date|null>(null);
  const [projectStatus, setProjectStatus] = useState(-1);
  const [osAmount, setOsAmount] = useState(-1);
  const [loanType, setLoanType] = useState(-1);
  const [loanProd, setLoanProd] = useState(-1);
  const [secured, setSecured] = useState(-1);
  const [sanctionDate, setSanctionDate] = useState<Date|null>(null);
  const [closureDate, setClosureDate] = useState<Date|null>(null);
  const [repaymentDate, setRepaymentDate] = useState<Date|null>(null);
  const [dsraApp, setDsraApp] = useState(-1);
  const [dsraForm, setDsraForm] = useState(-1);
  const [dsraCreated, setDsraCreated] = useState(-1);
  const [dsraAmount, setDsraAmount] = useState(-1);

  const [fieldList, setFieldList] = useState([
    { label:"AID", name:"Agreement ID", type:"text", value:agmtId, setter:setAgmtId, required: true },
    { label:"Z", name:"Zone", type:"select", value:zone, setter:setZone, options:["op1","op2"], required: true },
    { label:"CN", name:"Company Name", type:"text", value:comName, setter:setComName, required: true },
    { label:"panNum", name:"PAN Number", type:"text", value:panNum, setter: setPanNum, required: true },
    { label:"groupName", name:"Group Name", type:"text", value:groupName, setter:setGroupName, required: true },
    { label:"gstNum", name:"GST Number", type:"text", value:gstNum, setter:setgstNum, required: false },
    { label:"cinNum", name:"CIN Number", type:"text", value:cinNum, setter:setCinNum, required: false },
    { label:"I", name:"Industry", type:"select",value:industry, setter:setIndutry, options:["op1","op2"], required: true },
    { label:"SA", name:"Sanction Amount", type:"number", value:sanctionAmount, setter:setSanctionAmount, required: true },
    { label:"HA", name:"Hold Amount", type:"number", value:holdAmount, setter:setHoldAmount, required: true },
    { label:"DA", name:"Downsell Amount", type:"number", value:downsellAmount, setter:setDownsellAmount, required: true },
    { label:"DD", name:"Downsell Date", type:"date", value:downsellDate, setter:setDownsellDate, required: false },
    { label:"PS", name:"Project Status", type:"select", value:projectStatus, setter:setProjectStatus, options:["op1","op2"], required: true },
    { label:"OA", name:"O/S Amount", type:"number", value:osAmount, setter:setOsAmount, required: false },
    { label:"T", name:"Loan Type", type:"select", value:loanType, setter:setLoanType, options:["op1","op2"], required: true },
    { label:"P", name:"Loan Product", type:"select", value:loanProd, setter:setLoanProd, options:["op1","op2"], required: false },
    { label:"ST", name:"Secured", type:"select", value:secured, setter:setSecured, options:["op1","op2"], required: true },
    { label:"SD", name:"Sanction Date", type:"date", value:sanctionDate, setter:setSanctionDate, required: true },
    { label:"CD", name:"Loan Closure Date", type:"date", value:closureDate, setter:setClosureDate, required: true },
    { label:"RED", name:"Repayment End Date", type:"date", value:repaymentDate, setter:setRepaymentDate, required: false },
    { unnecessaryComplication: true, label:"A", name:"DSRA Applicability", type:"select", value:dsraApp, setter:setDsraApp, options:["op1","op2"], required: false },
    { unnecessaryComplication: true, label:"F", name:"DSRA Form", type:"select", value:dsraForm, setter:setDsraForm, options:["op1","op2"], required: false },
    { unnecessaryComplication: true, label:"S", name:"DSRA Created or Not", type:"select", value:dsraCreated, setter:setDsraCreated, options:["op1","op2"], required: false },
    { unnecessaryComplication: true, label:"V", name:"DSRA Amount", type:"number", value:dsraAmount, setter:setDsraAmount, required: false },
  ]);

  const {createLoan} = useGlobalContext();


  const submitForm = (/* e:any */) => {
    /* e.preventDefault(); */
    let data:any={};
    let dsra:any={}
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];

      if (field.unnecessaryComplication){
        if (field.value!=-1)
          dsra[field.label] = field.value;
        continue
      }
      
      switch(field.type){
        case "text":
          if (field.value!="")
            data[field.label] = field.value
          break;

        case "number" || "select":
          if (field.value!=-1)
            data[field.label] = field.value
          break;

        case "date":
          if (field.value!=null)
            data[field.label] = field.value
          break;

        default:
          break;
      }
    }

    data["dsra"] = dsra;

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

/*     createLoan(data).then(res=> console.log(res)
    ).catch(err=> console.log(err)) */

  }

  return(
    <div className="">
      <br/>
      <form className="grid grid-cols-4" onSubmit={submitForm}>
        {fieldList.map(field=>{
          if (field.type=="select")
            return <FormSelectField key={field.label} id={field.label} label={field.name} setter={field.setter} optionsList={field.options} required={field.required} />
          else
            return <FormTextField key={field.label}  id={field.label} label={field.name} setter={field.setter} type={field.type} required={field.required} />
        })}

      <FormSectionNavigation  />
      </form>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div className="my-6">
      <label htmlFor={props.id}>{props.label} {props.required?<span className="text-red-600">*</span>:""}</label>
      <input className="border-2 p-4 w-4/5 rounded-xl" min={props.type=="number"?"0.00001":""} id={props.id} type={props.type} onChange={(e)=>{props.setter(e.target.value)}}/>
    </div>
  )
}

function FormSelectField(props:any) {
  return (
    <div className="my-6">
      <label htmlFor={props.id}>{props.label} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <select className="border-2 bg-white w-4/5 p-4 rounded-xl" id={props.id}>
        {props.optionsList.map((option:any, index:number)=>{
          return <option key={index} value={index}>{option}</option>
        })}
      </select>
    </div>
  )
}

export default BasicDetails;
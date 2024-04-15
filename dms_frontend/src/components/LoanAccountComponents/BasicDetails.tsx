import { useState } from "react";

function BasicDetails() {
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
  const [downsellDate, setDownsellDate] = useState (new Date());
  const [projectStatus, setProjectStatus] = useState(-1);
  const [osAmount, setOsAmount] = useState(-1);
  const [loanType, setLoanType] = useState(-1);
  const [loanProd, setLoanProd] = useState(-1);
  const [secured, setSecured] = useState(-1);
  const [sanctionDate, setSanctionDate] = useState(new Date());
  const [closureDate, setClosureDate] = useState(new Date());
  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [dsraApp, setDsraApp] = useState(-1);
  const [dsraForm, setDsraForm] = useState(-1);
  const [dsraCreated, setDsraCreated] = useState(-1);
  const [dsraAmount, setDsraAmount] = useState(-1);

  const [fieldList, setFieldList] = useState([
    ["agmtId","Agreement ID", "text", setAgmtId],
    ["zone", "Zone","select",setZone, ["op1","op2"]],
    ["comName", "Company Name", "text", setComName],
    ["panNum", "PAN Number", "text", setPanNum],
    ["groupName", "Group Name", "text", setGroupName],
    ["gstNum", "GST Number", "text", setgstNum],
    ["cinNum", "CIN Number", "text", setCinNum],
    ["industry", "Industry", "select", setIndutry, ["op1","op2"]],
    ["sanctionAmount", "Sanction Amount", "number", setSanctionAmount],
    ["holdAmount","Hold Amount", "number", setHoldAmount],
    ["downsellAmount", "Downsell Amount", "number", setDownsellAmount],
    ["downsellDate", "Downsell Date", "date", setDownsellDate],
    ["projectStatus", "Project Status","select", setProjectStatus, ["op1","op2"]],
    ["osAmount", "O/S Amount", "number", setOsAmount],
    ["loanType", "Loan Type", "select", setLoanType, ["op1","op2"]],
    ["loanProd", "Loan Product", "select", setLoanProd, ["op1","op2"]],
    ["secured", "Secured", "select", setSecured, ["op1","op2"]],
    ["sanctionDate", "Sanction Date", "date", setSanctionDate],
    ["closureDate", "Loan Closure Date", "date", setClosureDate],
    ["repaymentDate", "Repayment End Date", "date", setRepaymentDate],
    ["dsraApp", "DSRA Applicability", "select", setDsraApp, ["op1","op2"]],
    ["dsraForm", "DSRA Form", "select", setDsraForm, ["op1","op2"]],
    ["dsraCreated", "DSRA Created or Not", "select", setDsraCreated, ["op1","op2"]],
    ["dsraAmount", "DSRA Amount", "number", setDsraAmount],
  ]);

  const submitForm = (e:any) => {
    e.preventDefault();
  }
  
  return(
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold mx-7 mb-2">Basic Details</p>
      <hr/>
      <form className="grid grid-cols-4 p-7" onSubmit={submitForm}>
        {fieldList.map(field=>{
          if (field[2]=="select")
            return <FormSelectField id={field[0]} label={field[1]} setter={field[3]} optionsList={field[4]} />
          else
            return <FormTextField id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
        })}
      </form>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div className="my-6">
      <label htmlFor={props.id}>{props.label}</label>
      <input className="border-2 p-4 w-4/5 rounded-xl" id={props.id} type={props.type} onChange={(e)=>{props.setter(e.target.value)}}/>
    </div>
  )
}

function FormSelectField(props:any) {
  return (
    <div className="my-6">
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <select className="border-2 bg-white w-4/5 p-4 rounded-xl" id={props.id}>
        {props.optionsList.map((option:any, index:number)=>{
          return <option value={index}>{option}</option>
        })}
      </select>
    </div>
  )
}

export default BasicDetails;
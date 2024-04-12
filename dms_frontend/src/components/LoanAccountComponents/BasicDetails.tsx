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
  const [dsraApp, setDsraApp] = useState(-1);
  const [dsraForm, setDsraForm] = useState(-1);
  const [dsraCreated, setDsraCreated] = useState(-1);
  const [dsraAmount, setDsraAmount] = useState(-1);

  const [fieldList, setFieldList] = useState([
    ["agmtId","Agreement ID", "text", setAgmtId],
    ["zone", "Zone","select",setZone],
    ["comName", "Company Name", "text", setComName],
    ["panNum", "PAN Number", "text", setPanNum],
    ["groupName", "Group Name", "text", setGroupName],
    ["gstNum", "GST Number", "text", setgstNum],
    ["cinNum", "CIN Number", "text", setCinNum],
    ["industry", "Industry", "select", setIndutry],
    ["sanctionAmount", "Sanction Amount", "text", setSanctionAmount],
    ["holdAmount","Hold Amount", "text", setHoldAmount],
    ["downsellAmount", "Downsell Amount", "text", setDownsellAmount],
    ["downsellDate", "Downsell Date", "date", setDownsellDate],
    ["projectStatus", "Project Status","text", setProjectStatus],
    ["osAmount", "O/S Amount", "text", setOsAmount],
    ["loanType", "Loan Type", "text", setLoanType],
    ["loanProd", "Loan Product", "text", setLoanProd],
    ["secured", "Secured", "text", setSecured],
    ["sanctionDate", "Sanction Date", "text", setSanctionDate],
  ])
  
  return(
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold mx-7 mb-2">Basic Details</p>
      <hr/>
      <div>
      </div>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input id={props.id} type={props.type} onChange={(e)=>{props.setter(e.target.value)}}/>
    </div>
  )
}

function FormSelectField(props:any) {
  return (
    <div>
      <select>
        {props.optionsList.map((option:any, index:number)=>{
          return <option value={index}>{option}</option>
        })}
      </select>
    </div>
  )
}

export default BasicDetails;
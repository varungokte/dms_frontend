import { useState } from "react";

function BankDetails() {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState(-1);
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");

  const [firstRow, setFirstRow] = useState([
    ["accountName", "Account Name", "text", setAccountName],
    ["accountNumber", "Account Number", "text", setAccountNumber],
  ]);
  
  const [secondRow, setSecondRow] = useState([
    ["accountType", "Account Type", "select", setAccountType, ["op1","op2"]],
    ["ifsc", "IFSC", "text", setIfsc],
    ["bankName", "Bank Name", "text", setBankName],
  ]);
  const [thirdRow, setThirdRow] = useState([
    ["branchName", "Branch Name", "text", setBranchName],
    ["branchAddress", "Branch Address", "text", setBranchAddress],
  ])

  return (
    <div className="">
      <br/>
      <form>
        <div className="grid grid-cols-2 py-5">
          {firstRow.map(field=>{
            if (field[2]=="select")
              return <FormSelectField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} optionsList={field[4]} />
            else
              return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
          })}
        </div>

        <div className="grid grid-cols-3 py-5">
          {secondRow.map(field=>{
            if (field[2]=="select")
              return <FormSelectField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} optionsList={field[4]} />
            else
              return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
          })}
        </div>

        <div className="grid grid-cols-2 py-5">
          {thirdRow.map(field=>{
            if (field[2]=="select")
              return <FormSelectField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} optionsList={field[4]} />
            else
              return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
          })}
        </div>
      </form>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div className="">
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <input className="border-2 p-4 w-11/12 rounded-xl" id={props.id} type={props.type} onChange={(e)=>{props.setter(e.target.value)}}/>
    </div>
  )
}

function FormSelectField(props:any) {
  return (
    <div className="">
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <select className="border-2 bg-white w-11/12 p-4 rounded-xl" id={props.id}>
        {props.optionsList.map((option:any, index:number)=>{
          return <option key={index} value={index}>{option}</option>
        })}
      </select>
    </div>
  )
}

export default BankDetails;
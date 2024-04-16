import { useState } from "react"

function SecurityDetails(){
  const [securitiesList, setSecurities] = useState([])

  const [sharePercentage, setSharePercentage] = useState(-1);
  const [valuationDate, setValuationDate] = useState(new Date());
  const [securityType, setSecurityType] = useState(-1);
  const [securityValue, setSecurityValue] = useState(-1);

  const [fieldList, setFieldList] = useState([
    ["sharePercentage", "Share Percentage(%)", "number", setSharePercentage],
    ["valuationDate", "Date of Valuation", "date", setValuationDate],
    ["securityType", "Security Type", "select", setSecurityType, ["op1","op2"]],
    ["securityValue", "Security Value", "text", setSecurityValue]
  ])
  return(
    <div className="">
      <br/>
      <form className="grid grid-cols-2">
        {fieldList.map(field=>{
          if (field[2]=="select")
            return <FormSelectField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} optionsList={field[4]} />
          else 
            return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
        })}
      </form>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div className="my-6">
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
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
          return <option key={index} value={index}>{option}</option>
        })}
      </select>
    </div>
  )
}


export default SecurityDetails
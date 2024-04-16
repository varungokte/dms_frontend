import { useState } from "react";

function Address(props:any) {
  const [localAddress, setLocalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState(-1);
  const [country, setCountry] = useState("");

  const [firstRow, setFirstRow] = useState([
    ["localAddress", "Building Name/Street/Locality", "text", setLocalAddress],
    ["city", "City", "text", setCity],
  ])
  const [secondRow, setSecondRow] = useState([
    ["state", "State", "text", setState],
    ["pincode", "Pincode", "number", setPincode],
    ["country", "Country", "text", setCountry],
  ])

  return (
    <div className="">
      <br/>
      <form >
        <div className="grid grid-cols-2 py-5">
          {firstRow.map(field=>{
            return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} type={field[2]} />
          })}
        </div>
        <div className="grid grid-cols-3 py-5">
          {secondRow.map(field =>{
            return <FormTextField key={field[0]} id={field[0]} label={field[1]} setter={field[3]} fieldType={field[2]} />
          })}
        </div>
      </form>
      <br/>
    </div>
  )
}

function FormTextField(props:any) {
  return (
    <div className="">
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <input className="border-2 p-4 w-11/12 rounded-xl" id={props.id} type={props.fieldType} onChange={(e)=>{props.setter(e.target.value)}}/>
    </div>
  )
}

export default Address;
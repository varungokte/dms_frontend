function FormTextField(props:any) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <input className="border-2 p-4 w-4/5 rounded-xl" 
        id={props.id} 
        type={props.type} 
        /* required={props.required} */ 
        disabled={props.disabled} 
        min={props.type=="number"?0:""}
        value={props.value} 
        onChange={(e)=>{
          props.setter((curr:any)=>{
            const obj = {...curr};
            obj[props.id] = e.target.value;
            return obj;
          })
        }}
      />
    </div>
  )
}

function FormSelectField(props:any) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <select className="border-2 bg-white w-4/5 p-4 rounded-xl" id={props.id} disabled={props.disabled}
        onChange={(e)=>{
          props.setter((curr:any)=>{
            const obj = {...curr};
            obj[props.id] = e.target.value;
            return obj;
          })
        }}
      >
        <option className="font-light" key={-1} value={-1}>Select {props.name}</option>
        {props.optionsList.map((option:any, index:number)=>{
          return <option key={index} value={index+1} selected={props.value==index+1}>{option}</option>
        })}
      </select>
    </div>
  )
}

export {FormTextField, FormSelectField};

/* 
props:
  id, name, required = true || false, type = "text" || "number" || etc, setter = setFieldName
*/
function TextField (props:{index:number, id:string, name: string, type: string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function }) {
  return(
    <div key={props.index+props.id+"t_0"} className="mb-5">
      <label key={props.index+props.id+"t_1"} htmlFor={props.id} className="font-light text-lg">{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full h-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{
            props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
            props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
          }
        } 
      />
    </div>
  )
};

function SelectField (props:{index:number, id:string, name: string, options: string[], required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}){
  try{
    return(
      <div key={props.index+props.id+"s_0"} className="mb-5">
        <label key={props.index+props.id+"s_1"} htmlFor={props.id} className="font-light text-lg">{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
        <br/>
        <select key={props.index+props.id+"s_2"} id={props.id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          value={props.prefillValues[props.id]}
          required={props.required}
          onChange={(e)=>props.setter((curr:any)=>{curr[props.id]=Number(e.target.value)+1;  return curr})
          } 
        >
          <option key={props.index+"_0"} value={""}>Select {props.name}</option>
          {props.options.map((option:any,optionIndex:any)=>{
            return <option key={props.index+"_"+optionIndex} selected={props.prefillValues[props.id]==optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  } 
  catch(err){
    return <></>
  }
};

function TextAreaField (props:{index:number, id: string, name:string, setter:Function, prefillValues:any, setPrefillValues:Function}) {
  return (
    <div key={props.index}>
      <label htmlFor={props.id}>{props.name}</label>
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        onChange={(e)=>{
          props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
          props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
        }}
      />
    </div>
  )
};


export { TextField, SelectField, TextAreaField };
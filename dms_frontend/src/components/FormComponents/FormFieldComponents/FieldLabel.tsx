function FieldLabel (props:{index:number|string, id:string, name:string, required:boolean, disabled:boolean}){
  return(
    <label 
      key={props.index+props.id+"1"} htmlFor={props.id} 
      className={`font-light text-lg ${props.disabled?"text-gray-700":""} ${props.name==""?"mx-5":""}`}
    >
      {props.name} {props.required?<span className="text-red-600">*</span>:""}
    </label>
  )
}

export default FieldLabel;
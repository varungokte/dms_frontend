function RequiredFieldsNote(props:{error?:boolean}){
  return <p className="italic">Fields marked with <span className="text-red-600">*</span> are <span className={`font-bold ${props.error?"text-red-600":""}`}>required fields</span>.</p>
}

export default RequiredFieldsNote;
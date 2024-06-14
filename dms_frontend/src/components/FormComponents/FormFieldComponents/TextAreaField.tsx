import FieldLabel from "./FieldLabel";

function TextAreaField (props:{index:number|string, id: string, name:string, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}) {
  return (
    <div key={props.index}>
      <FieldLabel key={props.index+"ta_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})}}
      />
    </div>
  )
};

export default TextAreaField;
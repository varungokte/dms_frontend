import FieldLabel from "./FieldLabel";

function FloatNumberField(props:{index:number|string, type?:"curr"|"rate", id:string, name: string, required?:boolean, disabled?:boolean, prefillValues:any, setPrefillValues:Function, className?:string, repeatFields?:boolean, formIndex?:number, enableDecimal?:boolean }){
  return (
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"t_1"} index={props.index} id={props.id} name={props.name} required={props.required} disabled={props.disabled} />
      <input id={props.id} name={props.name} type="number"
        className={props.className || `border rounded-if w-full p-4 ${props.name==""?"mt-7":""}`}
        required={props.required} disabled={props.disabled} 
        value={props.repeatFields && props.formIndex!=undefined
          ?props.prefillValues[props.formIndex]&&props.prefillValues[props.formIndex||0][props.id]
            ?Number(props.prefillValues[props.formIndex||0][props.id])
            :""
          :props.prefillValues[props.id]?Number(props.prefillValues[props.id]):""
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?e=>{
            if (!isNaN(Number(e.target.value))){
              props.setPrefillValues((curr:any)=>{
                curr[props.formIndex||0][props.id] = Number(e.target.value);
                return [...curr];
              })
            }
          }
          :e=>{
            if (!isNaN(Number(e.target.value))){
              props.setPrefillValues((curr:any)=>{
                curr[props.id] = Number(e.target.value);
                return {...curr};
              })
            }
          }
        } 
      />
    </div>
  )
}

export default FloatNumberField;
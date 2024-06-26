const CheckboxField = (props:{index:number|string, id:string, name: string, required?:boolean, disabled?:boolean, prefillValues:any, setPrefillValues:Function }) => {
  return (
    <div className="flex flex-row">
      <input type="checkbox" className="mr-3" 
        checked={(props.prefillValues && props.prefillValues[props.id]==true)||false} 
        onChange={()=>{props.setPrefillValues((curr:any)=>{curr[props.id]=true; return {...curr}})}} 
      />
      <p>{props.name}</p>
    </div>
  )
}

export default CheckboxField;
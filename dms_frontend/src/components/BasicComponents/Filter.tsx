function Filter(props:any){
  return(
    <select className="bg-white border-2 p-6 mt-1 rounded-xl" onChange={(e:any)=>{props.setter(e.target.value)}}>
      {props.setPlaceholder?<option value={props.placeholderValue[0]}>{props.placeholderValue[1]}</option>:""}
      
      {props.labelList.map((item:any,index:number)=>{
        if (props.listsAreSame)
          return <option value={item}>{item}</option>
        else
          return <option value={props.valueList[index]}>{item}</option>
      })}
      </select>
  )
}

export default Filter;

/* props:
    setter
    listsAreSame
    valueList
    setPlaceholder
    placeholderValue={[value,label]}
 */
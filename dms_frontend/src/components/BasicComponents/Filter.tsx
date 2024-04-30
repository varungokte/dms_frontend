function Filter(props:any){
  return(
    <select className="bg-white border-2 p-3 rounded-xl" value={props.currentValue} onChange={(e:any)=>{props.setter(e.target.value)}}>
      {props.setPlaceholder?<option value={props.placeholderValue[0]}>{props.placeholderValue[1]}</option>:""}
      
      {props.labelList.map((item:any,index:number)=>{
        if (props.listsAreSame)
          return <option key={index} value={item}>{item}</option>
        else
          return <option key={index} value={props.valueList[index]}>{item}</option>
      })}
      </select>
  )
}

export default Filter;

/* props:
    setter
    listsAreSame
    labelList
    valueList (if !listsAreSame)
    setPlaceholder
    placeholderValue={[value,label]}
 */
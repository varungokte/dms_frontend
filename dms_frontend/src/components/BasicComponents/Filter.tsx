function Filter(props:any){
  return(
    <select className="bg-white border-2 p-5 h-full rounded-xl" onChange={(e:any)=>{props.setter(e.target.value)}}>
      {props.setPlaceholder?<option value={props.placeholderValue[0]}>{props.placeholderValue[1]}</option>:""}
      
      {props.labelList.map((item:any,index:number)=>{
        if (props.listsAreSame)
          return <option value={item} selected={props.currentValue==item?true:false}>{item}</option>
        else
          return <option value={props.valueList[index]} selected={props.currentValue==item?true:false}>{item}</option>
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
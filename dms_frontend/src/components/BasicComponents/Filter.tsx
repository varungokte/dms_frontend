//FILTER SHOWS VALUE-1

function Filter(props:{setter:Function, placeholderValue?:any[], setPlaceholder?:boolean, valueList:any[] }){
  return(
    <select className="bg-white border-2 p-1 h-[50px] rounded-xl" onChange={(e:any)=>{console.log(e.target.value); props.setter(e.target.value)}}>
      {props.setPlaceholder && props.placeholderValue!=undefined?<option value={props.placeholderValue[0]}>{props.placeholderValue[1]}</option>:""}
      
      {props.valueList.map((item:any,index:number)=>{
        if (index!-=0)
        return <option key={index} value={props.valueList[index]}>{item}</option>
      })}
      </select>
  )
}

export default Filter;
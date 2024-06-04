//FILTER SHOWS VALUE-1

function Filter(props:{setter:Function, placeholderValue?:any[], setPlaceholder?:boolean, labelList:any[], listsAreSame?:boolean, valueList?:any[] }){
  /* useEffect(()=>{
    console.log("PROPS ",props);
    console.log("LABEL LIST ", props.labelList);
    console.log("VALUE LIST ", props.valueList);
  },[props]); */
  
  return(
    <select className="bg-white border-2 p-1 h-[50px] rounded-xl" onChange={(e:any)=>{console.log(e.target.value); props.setter(e.target.value)}}>
      {props.setPlaceholder && props.placeholderValue!=undefined?<option value={props.placeholderValue[0]}>{props.placeholderValue[1]}</option>:""}
      
      {props.labelList.map((item:any,index:number)=>{
        if (props.listsAreSame)
          return <option key={index} value={item}>{item}</option>
        else if(props.valueList!=undefined)
          return <option key={index} value={props.valueList[index]}>{item}</option>
      })}
      </select>
  )
}

export default Filter;
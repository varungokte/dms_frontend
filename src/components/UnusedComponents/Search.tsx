/* function Search(props:{label:string, setter:Function, className?:string}){
  return(
    <input 
      type="text" 
      className={`border-2 h-[50px] p-5 rounded-xl ${props.className||""}`}
      placeholder={props.label} 
      onChange={(e)=>{ props.setter((e.target.value+"").replace("\\", "/\\/")) }} 
    />
  )
}

export default Search; */
function Search(props:any){
  return(
    <input 
      type="text" 
      className="border-2 mx-10 h-full p-5 rounded-xl" 
      placeholder={props.label} 
      onChange={
        (e)=>{ props.setter((e.target.value+"").replace("\\", "/\\/")) }
      } 
    />
  )
}

export default Search;


/* props:
    label: "Search" OR "Search Products"
    setter: setSearchString
*/
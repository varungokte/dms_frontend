function Search(props:any){
  return(
    <input 
      type="text" 
      className="border-2 mx-10 h-full p-5 rounded-xl" 
      placeholder={props.label} 
      onChange={
        (e)=>{
        const val = e.target.value+"";
        props.setter(val.replace("\\", "/\\/"))
        }
      } 
    />
  )
}

export default Search;


/* props:
    label: "Search" OR "Search Products"
    setter: setSearchString
*/
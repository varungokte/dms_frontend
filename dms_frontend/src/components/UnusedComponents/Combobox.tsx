import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

function Combobox(props:{type:"single"|"multiple", label:string, placeholder:string,options:[{label:string,values:Object}], value:string, setResults:Function}) {
	const [value, setValue] = useState(props.value);
  /* const [options] = useState([
		{ label: "Kal-El (Superman)", values:{N:"Kal-El", R:"Superman"} },
		{ label: "Bruce Wayne (Batman)", values:{N:"Bruce Wayne", R:"Batman"} },
		{ label: "Dick Grayson (Nightwing)", values:{N:"Dick Grayson", R:"Nightwing"} },
		{ label: "Kara Danvers (Supergirl)", values:{N:"Kara Danvers", R:"Supergirl"} },
		{ label: `User1 <email@email>`, values:{N:"User1", E:"email@email"}}
	]); */

  return (
    <Autocomplete 
      multiple={props.type==="multiple"}
      onChange={(_,temp)=>props.setResults(temp)} 
      options={props.options} 
      getOptionLabel={(option)=>option.label} 
      filterOptions={(optionsList)=>{
        if (value=="")
          return optionsList;

        const newOptionsList:any = []; 
        const regEx = new RegExp(value, "i");
        for (let i=0; i<optionsList.length; i++){
          let found = false;
          const values=Object.values(optionsList[i].values);
          console.log("value array",values);
          for (let j=0; j<values.length; j++){
            console.log("spec value", values[j]);
            if (values[j].search(regEx)!==-1) 
              found = true;
          }
          if (found){
            newOptionsList.push(optionsList[i]);
            console.log("adding",optionsList[i]);
          }
        }
        return newOptionsList;
      }}
      renderInput={(vals)=><TextField {...vals} value={value} onChange={(e)=>{setValue(e.target.value)}} label={props.label} placeholder={props.placeholder} />} 
    />
  )
}

export default Combobox;
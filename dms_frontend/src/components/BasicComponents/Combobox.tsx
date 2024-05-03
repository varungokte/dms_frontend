import { useState } from "react";
/* 
props:
  optionsList= []
  enteredTerm, setEnteredTerm
  displayMultipleLines: true
  displayFields: ["N","E"]
*/

function Combobox(props:any){
	const [optionsList, setOptionsList] = useState(props.optionsList);
	const [showSuggestions, setShowSuggestions] = useState(true);
	const [currentSuggestion, setCurrentSuggestion] = useState(-1);
	const [suggestions, setSuggestions] = useState<any>([]);

  const [enteredTerm, setEnteredTerm] = useState("");

	const suggest = (e:any)=>{
    e.preventDefault();
		setShowSuggestions(true);
		const text = e.target.value;
		const regEx = new RegExp(text, "i");
		const results = [];
		for (let i=0; i<optionsList.length; i++){
			const str = optionsList[i];
      let stringExists = false;

      if (!props.displayMultipleLines)
        stringExists=!(str.search(regEx)==-1);
      else {
        for (let i=0; i<props.displayFields.length; i++)
          stringExists = stringExists || !(str[props.displayFields[i]].search(regEx)==-1)
      }

      if (stringExists)
        results.push(str);
		}
		setEnteredTerm(text);
		setSuggestions(results);
	};

  return (
    <div className="">
      <input className={props.className} onChange={suggest} value={enteredTerm} required style={{zIndex:"90"}} />
        {enteredTerm.length>0 && showSuggestions
          ?<div className="bg-white border-2 w-60" style={{position: "absolute", overflowY:"scroll", zIndex:"100"}}>
            {suggestions.map((option:any,index:number)=>{
            return (
              <div key={index}
                className={`border h-full ${currentSuggestion==index?"bg-gray-200":""}`} 
                onClick={()=>{
                  {props.displayMultipleLines?setEnteredTerm(option[props.displayFields[0]]):setEnteredTerm(option)}; 
                  setShowSuggestions(false);
                  props.setFinalResult(option);
                }} 
                onMouseEnter={()=>setCurrentSuggestion(index)}
              >
                {props.displayMultipleLines
                  ?<div>
                    { props.displayFields.map((field:any,fieldIndex:number)=>{return <div className={fieldIndex!=0?"font-light italic":""}>{option[field]}</div>})}
                  </div>
                 
                  :<div>{option}</div>
                }
              </div>
            )
          })}
          </div>
          :""
        }
      <input type="" style={{width:"0px"}}/>
    </div>
  )
}



export default Combobox;
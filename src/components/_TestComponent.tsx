import { useEffect, useState, useReducer } from "react";
import TableKeyValues from "./BasicTables/TableKeyValues";

function _TestComponent(){
  const reducer = (state:number, action:"inc"|"dec") => {
    if (action=="inc")
      return state+1;
    else
      return state-1;
  };

  useEffect(()=>{
    //const keyDownEvent = (e:KeyboardEvent)=>console.log("key pressed on page",e.code);
    //document.addEventListener("keydown", keyDownEvent);
    /* return (()=>{
      document.removeEventListener("keydown", keyDownEvent);
    }) */
  },[]);

  const [prefillValues, setPrefillValues] = useState<{[key:string]: {V:string, S?:string}[]}>({});
  
  useEffect(()=>{
    setPrefillValues({
      Planets: [{V:"Vulcan"},{V:"Mandalore"},{V:"Krypton"},{V:"Raxacoricofallapatorius"},{V:"Skaro"},{V:"Mondas"},{V:"Kwenn"}, {V:"Cardassia"}, {V:"Tatooine"},{V:"Bajor"},{V:"Trill"},{V:"Kashyyyk"}],
      Species: [{V:"Time Lords"},{V:"Klingons"},{V:"Trandoshans"},{V:"Wookies"},{V:"Cardassians"}],
      Vehicles: [{V:"USS Enterprise"},{V:"Millenium Falcon"},{V:"TARDIS"},{V:"Batmobile"}],
    })
  },[]);
 
  const [state, dispatch] = useReducer(reducer,0);
  
  return (
    <div className="m-9">
      <div>
        <button onClick={()=>dispatch("dec")}>-</button>
        {state}
        <button onClick={()=>dispatch("inc")}>+</button>
      </div>
      <br />
      <div> 
        <TableKeyValues prefillValues={prefillValues||{}} setPrefillValues={setPrefillValues} />
      </div> 
      <br />
    </div>
  );

}

export default _TestComponent;